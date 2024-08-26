const express = require('express');
const { registerUser, loginUser, getUserProfile, getUserProjects, getUserTotalEarnings, getTotalProjectsPrice,  getAllDevelopers, getProjectsByMonthAndSales, deleteUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { updatePassword } = require('../controllers/userController');
const { updateProfile } = require('../controllers/userController');
const { getAllUsers } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', protect, getUserProfile);

router.put('/update-password', protect, updatePassword);

router.put('/profile', protect, updateProfile);

router.get('/get-all-users', protect, adminOnly, getAllUsers);

router.get('/get-all-developers', protect, getAllDevelopers);

router.get('/get-projects', protect, getUserProjects);

router.get('/get-total-earnings', protect, getUserTotalEarnings);

router.get('/total-sales/:userId', protect, getTotalProjectsPrice);

router.get('/get-projects-by-month-and-sales', protect, getProjectsByMonthAndSales);

router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
