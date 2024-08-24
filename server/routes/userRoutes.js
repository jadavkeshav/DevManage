const express = require('express');
const { registerUser, loginUser, getUserProfile, getUserProjects, getUserTotalEarnings } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { updatePassword } = require('../controllers/userController');
const { updateProfile } = require('../controllers/userController');
const { getAllUsers } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', protect, getUserProfile);

router.put('/update-password', protect, updatePassword);

router.put('/update-profile', protect, updateProfile);

router.get('/get-all-users', protect, adminOnly, getAllUsers);

router.get('/get-projects', protect, getUserProjects);

router.get('/get-total-earnings', protect, getUserTotalEarnings);

module.exports = router;
