const Project = require('../models/projectModel');
const User = require('../models/userModel');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (user must be logged in)
const createProject = async (req, res) => {
    const { projectName, projectDesc, projectUrl, price, submissionDate, selectedDevelopers, requirements, developerShares, endPoints } = req.body;
  
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
        endPoints
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
  

module.exports = { createProject };
