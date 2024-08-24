const express = require('express');
const { createProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new project
router.post('/create', protect, createProject);

module.exports = router;
