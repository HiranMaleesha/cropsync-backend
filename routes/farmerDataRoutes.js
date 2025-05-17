const express = require('express');
const router = express.Router();
const {
  getAllFarmerData,
  getFarmerDataById,
  createFarmerData,
  updateFarmerData,
  deleteFarmerData,
  getFarmersForDropdown,
  getAnalyticsData
} = require('../Controllers/FarmerDataController');

// GET all farmer data
router.get('/', getAllFarmerData);

// GET analytics data
router.get('/analytics', getAnalyticsData);

// GET farmers for dropdown
router.get('/farmers', getFarmersForDropdown);

// GET farmer data by ID
router.get('/:id', getFarmerDataById);

// POST create new farmer data
router.post('/', createFarmerData);

// PUT update farmer data
router.put('/:id', updateFarmerData);

// DELETE farmer data
router.delete('/:id', deleteFarmerData);

module.exports = router; 