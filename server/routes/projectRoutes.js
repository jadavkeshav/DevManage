const express = require('express');
const { createProject, deleteProject, getProjectDetails } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, createProject);

router.get('/:id', getProjectDetails);



router.delete('/:id', protect, deleteProject);



module.exports = router;
