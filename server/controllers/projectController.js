const Project = require('../models/projectModel');
const User = require('../models/userModel');



const getProjectDetails = async (req, res) => {
  const projectId = req.params.id;

  try {
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }
    const project = await Project.findById(projectId).populate('selectedDevelopers').exec();
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ project });
  } catch (error) {
    console.error('Error in getProjectDetails:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createProject = async (req, res) => {
  const { projectName, projectDesc, projectUrl, price, submissionDate, selectedDevelopers, requirements, developerShares, endPoints } = req.body;
  const userId = req.user._id;
  try {
    if (!projectName || !price || !submissionDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    if (isNaN(Date.parse(submissionDate))) {
      return res.status(400).json({ message: 'Invalid submission date' });
    }

    const validDevelopers = await User.find({ '_id': { $in: selectedDevelopers } });
    if (validDevelopers.length !== selectedDevelopers.length) {
      return res.status(400).json({ message: 'One or more developers are invalid' });
    }

    const newProject = new Project({
      projectName,
      projectDesc,
      projectUrl,
      price,
      submissionDate,
      selectedDevelopers,
      requirements,
      developerShares,
      endPoints,
      createdBy: userId
    });

    await newProject.save();

    await User.updateMany(
      { _id: { $in: selectedDevelopers } },
      { $push: { projects: newProject._id } }
    );

    res.status(201).json({
      message: 'Project created successfully',
      project: newProject
    });
  } catch (error) {
    console.error('Error in createProject:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteProject = async (req, res) => {
  const { id } = req.params; 
  const userId = req.user._id; 
  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy.toString() == userId) {
      const delProject = await Project.findByIdAndDelete(id);
      if (delProject) {
        await User.updateMany(
          { projects: project._id },
          { $pull: { projects: project._id } }
        );
        res.status(200).json({ message: 'Project deleted successfully' });
      }
    } else {
      return res.status(403).json({ message: 'You do not have permission to delete this project' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Not authorized as an admin' });
  }
};

const updateProjectSales = async (req, res) => {
  const { id } = req.params;
  const { sales } = req.body;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.sales = sales;

    await project.save();

    res.status(200).json({
      message: 'Sales updated successfully',
      project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSalesOverview = async (req, res) => {
  try {
      const salesData = await Project.aggregate([
        {
            $addFields: {
                totalRevenuePerProject: { $multiply: ["$sales", "$price"] } 
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalRevenuePerProject" },
                avgOrderValue: { $avg: "$price" },
                totalSales: { $sum: "$sales" } 
            }
        }
    ]);

      res.json({
          salesData
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  createProject,
  deleteProject,
  getProjectDetails,
  updateProjectSales,
  getSalesOverview

};
