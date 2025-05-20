const express = require('express');
const router = express.Router();
const {
  getAllFarmers,
  getFarmerById,
  createFarmer,
  checkFarmerByUid,
  updateFarmer,
  deleteFarmer
} = require('../Controllers/FarmerController');

// GET all farmers
router.get('/', getAllFarmers);

// GET farmer by ID
router.get('/:id', getFarmerById);

// POST create new farmer
router.post('/', createFarmer);

// Check if farmer exists by Firebase UID
router.get('/check/:uid', checkFarmerByUid);

// PUT update farmer
router.put('/:id', updateFarmer);

// DELETE farmer
router.delete('/:id', deleteFarmer);

module.exports = router; 