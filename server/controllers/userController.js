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
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userName: user.userName,
      role: user.role,
    });
  } else {
    return res.status(404).json({ message: 'User Not Found' });
  }
});


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

const updateProfile = async (req, res) => {
  const { name, phone } = req.body;
  const userId = req.user.id; // Assuming you're using JWT for authentication

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user information
    user.name = name || user.name;
    user.phone = phone || user.phone;

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error in updateProfile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

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
    const users = await User.find().select('name'); // Exclude password field from response
    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserProjects = async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from request object
    const userProjects = await Project.find({
      selectedDevelopers: userId,
    }).select('projectName projectDesc projectUrl price createdAt'); // Select only relevant fields

    const projectCount = await Project.countDocuments({
      selectedDevelopers: userId,
    });

    res.json({
      count: projectCount,
      projects: userProjects,
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
        totalEarning += (Price * share) / 100;
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

    // let totalSales = 0;

    // Calculate the total sales by summing up the prices of the projects
    const totalSales = projects.reduce((sum, project) => sum + project.price, 0);

    // Send the total sales as a response
    res.status(200).json({totalSales});
  } catch (error) {
    console.error('Error calculating total sales:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProjectsByMonth = async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from request object

    // Fetch all projects for the user
    const projects = await Project.find({ selectedDevelopers: userId })
                                  .select('createdAt');

    // Aggregate projects by month
    const monthlyData = projects.reduce((acc, project) => {
      const month = new Date(project.createdAt).toLocaleString('default', { month: 'short' });
      if (!acc[month]) acc[month] = 0;
      acc[month]++;
      return acc;
    }, {});

    // Convert to array of objects for chart
    const formattedData = Object.keys(monthlyData).map(month => ({
      name: month,
      projects: monthlyData[month]
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
  getProjectsByMonth,
  getAllDevelopers,
};
