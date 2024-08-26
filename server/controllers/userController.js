const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const path = require("path")
const ejs = require('ejs');



const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendThankYouEmail = async (email) => {
  const templatePath = path.join(__dirname, "..",'views', 'thanks.ejs');
  const html = await ejs.renderFile(templatePath);

  const mailOptions = {
    from: 'DevManage999@gmail.com',
    to: email,
    subject: 'Thank You for Joining Us!',
    html,
  };

  return transporter.sendMail(mailOptions);
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, userName, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
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
    sendThankYouEmail(email)
      .then(() => {
        console.log("User registerd")
      })
      .catch((error) => {
        console.error('Error sending ThankYou:', error);
      });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400).json({ message: 'Invalid user Data' });

  }
});


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

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
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ errors });
    } else if (error.code && error.code === 11000) {
      return res.status(400).json({ message: 'UserName already taken.' });
    }

    res.status(500).json({ message: 'An error occurred.', error: error.message });
  }
};


const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in updatePassword:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};



const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
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
    const userId = req.user._id;
    const userProjects = await Project.find({
      selectedDevelopers: userId,
    }).select('projectName projectDesc projectUrl sales price createdAt developerShares');
    const projectsWithShares = userProjects.map((project) => {
      const userShare = project.developerShares.get(userId.toString()) || 0;
      return {
        _id: project._id,
        projectName: project.projectName,
        projectDesc: project.projectDesc,
        projectUrl: project.projectUrl,
        sales: project.sales,
        price: project.price,
        createdAt: project.createdAt,
        userShare: userShare,
        userEarnings: (project.sales * project.price * (userShare / 100)).toFixed(2),
      };
    });

    const projectCount = await Project.countDocuments({
      selectedDevelopers: userId,
    });

    res.json({
      count: projectCount,
      projects: projectsWithShares,
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

    const projects = await Project.find({ selectedDevelopers: userId });

    const totalRevenue = projects.reduce((sum, project) => sum + (project.sales * project.price), 0);

    res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getProjectsByMonthAndSales = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({ selectedDevelopers: userId })
      .select('createdAt sales price');

    const monthlyData = projects.reduce((acc, project) => {
      const month = new Date(project.createdAt).toLocaleString('default', { month: 'short' });
      if (!acc[month]) acc[month] = { projects: 0, sales: 0 };
      acc[month].projects++;
      acc[month].sales += project.sales * project.price;
      return acc;
    }, {});

    const formattedData = Object.keys(monthlyData).map(month => ({
      name: month,
      projects: monthlyData[month].projects,
      sales: monthlyData[month].sales
    }));
    const sortedData = formattedData.sort((a, b) => {
      const months = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
      return months[a.name] - months[b.name];
    });

    res.json(sortedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    await Project.updateMany(
      { selectedDevelopers: userId },
      { $pull: { selectedDevelopers: userId } }
    );

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error });
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
  deleteUser,
};
