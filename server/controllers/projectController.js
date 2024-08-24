const Project = require('../models/projectModel');
const User = require('../models/userModel');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (user must be logged in)
const createProject = async (req, res) => {
  const { projectName, projectDesc, projectUrl, price, submissionDate, selectedDevelopers, requirements, developerShares, endPoints } = req.body;
  const userId = req.user._id;
  try {
    // Validate required fields
    if (!projectName || !price || !submissionDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate submissionDate is a valid date
    if (isNaN(Date.parse(submissionDate))) {
      return res.status(400).json({ message: 'Invalid submission date' });
    }

    // Check if selectedDevelopers are valid User ObjectIds
    const validDevelopers = await User.find({ '_id': { $in: selectedDevelopers } });
    if (validDevelopers.length !== selectedDevelopers.length) {
      return res.status(400).json({ message: 'One or more developers are invalid' });
    }

    // Create a new project
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

    // Update users with the new project ID
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
  const { id } = req.params; // Get project ID from the route parameter
  const userId = req.user._id; // Assuming req.user contains the authenticated user's info

  try {
    const project = await Project.findById(id);

    // Check if the project exists
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy.toString() == userId) {
      const delProject = await Project.findByIdAndDelete(id);
      // Delete the project
      if (delProject) {
        // Optionally, remove the project ID from the users' projects array
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
    // console.error('Error in deleteProject:', error.message);
    res.status(500).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = {
  createProject,
  deleteProject,

};
