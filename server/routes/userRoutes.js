const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { updatePassword } = require('../controllers/userController');
const { updateProfile } = require('../controllers/userController');
const { getAllUsers } = require('../controllers/userController');
const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

// Get user profile (protected route)
router.get('/profile', protect, getUserProfile);

router.put('/update-password', protect, updatePassword);

router.put('/update-profile', protect, updateProfile);

router.get('/get-all-users', protect, adminOnly, getAllUsers);

module.exports = router;
