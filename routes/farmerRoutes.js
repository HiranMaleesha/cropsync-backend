const express = require('express');
const router = express.Router();
const {
  getAllFarmers,
  getFarmerById,
  createFarmer,
  checkFarmerByUid,
  updateFarmer,
  deleteFarmer,
  getFarmerByEmail
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

// Get farmer by email
router.get('/email/:email', getFarmerByEmail);

module.exports = router; 