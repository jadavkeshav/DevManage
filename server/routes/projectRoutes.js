const express = require('express');
const { createProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, createProject);

router.delete('/:id', protect, deleteProject);



module.exports = router;
