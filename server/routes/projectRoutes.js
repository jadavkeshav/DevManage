const express = require('express');
const { createProject, deleteProject, getProjectDetails, updateProjectSales, getSalesOverview } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, createProject);

router.get('/:id', getProjectDetails);

router.get('/sales/overview', protect, getSalesOverview);

router.delete('/:id', protect, deleteProject);

router.put('/:id/sales', protect, updateProjectSales);



module.exports = router;
