const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, userName, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    phone,
    userName,
    password: hashedPassword,
    role,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  loginUser,
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, userName } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.userName = userName || user.userName;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      // Handle validation errors
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ errors });
    } else if (error.code && error.code === 11000) {
      // Handle duplicate key errors
      return res.status(400).json({ message: 'UserName already taken.' });
    }

    // Handle other errors
    res.status(500).json({ message: 'An error occurred.', error: error.message });
  }
};


const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // Assuming you're using JWT for authentication

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in updatePassword:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// const updateProfile = async (req, res) => {
//   const { name, phone } = req.body;
//   const userId = req.user.id; // Assuming you're using JWT for authentication

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update user information
//     user.name = name || user.name;
//     user.phone = phone || user.phone;

//     await user.save();

//     res.status(200).json({ message: 'Profile updated successfully', user });
//   } catch (error) {
//     console.error('Error in updateProfile:', error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field from response
    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllDevelopers = async (req, res) => {
  try {
    const users = await User.find().select('name email userName');
    const count = users.length;

    res.status(200).json({ count, users });
  } catch (error) {
    console.error('Error in getAllUsers:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserProjects = async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from request object

    // Find the projects where the user is a selected developer
    const userProjects = await Project.find({
      selectedDevelopers: userId,
    }).select('projectName projectDesc projectUrl sales price createdAt developerShares'); // Include developerShares field

    // Map the userProjects to include the user's share in each project
    const projectsWithShares = userProjects.map((project) => {
      const userShare = project.developerShares.get(userId.toString()) || 0; // Get user's share or default to 0
      return {
        _id: project._id,
        projectName: project.projectName,
        projectDesc: project.projectDesc,
        projectUrl: project.projectUrl,
        sales: project.sales,
        price: project.price,
        createdAt: project.createdAt,
        userShare: userShare,
        userEarnings: (project.sales * project.price * (userShare / 100)).toFixed(2), // Calculate user earnings based on share
      };
    });

    const projectCount = await Project.countDocuments({
      selectedDevelopers: userId,
    });

    res.json({
      count: projectCount,
      projects: projectsWithShares, // Send projects with user shares and earnings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getUserTotalEarnings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const projects = user.projects;

    let totalEarning = 0.0;

    for (let i = 0; i < projects.length; i++) {
      const Pro = await Project.findById(projects[i]);
      if (Pro) {
        const Price = parseFloat(Pro.price);
        const share = parseInt(Pro.developerShares.get(user._id));

        totalEarning += (Pro.sales * Price * share) / 100;
      } else {
        res.status(404).json({ message: "Project Not found" })
      }
    }
    res.status(200).json({ totalEarning: totalEarning });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTotalProjectsPrice = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find projects where the user is enrolled
    const projects = await Project.find({ selectedDevelopers: userId });

    // Calculate the total revenue by summing up the product of sales and price for each project
    const totalRevenue = projects.reduce((sum, project) => sum + (project.sales * project.price), 0);

    // Send the total revenue as a response
    res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getProjectsByMonthAndSales = async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from request object

    // Fetch all projects for the user
    const projects = await Project.find({ selectedDevelopers: userId })
      .select('createdAt sales price');

    // Aggregate projects by month and calculate sales
    const monthlyData = projects.reduce((acc, project) => {
      const month = new Date(project.createdAt).toLocaleString('default', { month: 'short' });
      if (!acc[month]) acc[month] = { projects: 0, sales: 0 };
      acc[month].projects++;
      acc[month].sales += project.sales * project.price;
      return acc;
    }, {});

    // Convert to array of objects for chart
    const formattedData = Object.keys(monthlyData).map(month => ({
      name: month,
      projects: monthlyData[month].projects,
      sales: monthlyData[month].sales
    }));

    // Ensure the data is sorted by month
    const sortedData = formattedData.sort((a, b) => {
      const months = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
      return months[a.name] - months[b.name];
    });

    res.json(sortedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updatePassword,
  updateProfile,
  getAllUsers,
  getUserProjects,
  getUserTotalEarnings,
  getTotalProjectsPrice,
  getProjectsByMonthAndSales,
  getAllDevelopers,
};
