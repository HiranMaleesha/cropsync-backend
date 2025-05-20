const express = require('express');
const router = express.Router();
const axios = require('axios');

const Farmer = require('../models/Farmer');
const CropData = require('../models/CropData');

router.get('/predict', async (req, res) => {
  try {
    const farmerId = req.user.id;

    const farmer = await Farmer.findById(farmerId);
    const region = farmer.region;

    const records = await CropData.find({ region });

    const crops = [...new Set(records.map(r => r.crop))];
    const month = new Date().getMonth() + 1;

    const predictions = [];

    for (const crop of crops) {
      const cropRecords = records.filter(r => r.crop === crop && r.month === month);

      const Total_Area = cropRecords.reduce((sum, r) => sum + r.area, 0);
      const Total_Wasted = cropRecords.reduce((sum, r) => sum + r.wasted, 0);
      const Total_Shortfall = cropRecords.reduce((sum, r) => sum + r.shortfall, 0);
      const Avg_Price = cropRecords.length > 0
        ? cropRecords.reduce((sum, r) => sum + r.price, 0) / cropRecords.length
        : 0;

      try {
        const response = await axios.post('http://localhost:5000/predict', {
          Crop: crop,
          Month_Num: month,
          Total_Area,
          Total_Wasted,
          Total_Shortfall,
          Avg_Price
        });

        predictions.push({
          crop,
          predicted_planted_amount: response.data.predicted_planted_amount
        });
      } catch (error) {
        console.error(`Prediction failed for ${crop}:`, error.message);
        predictions.push({
          crop,
          predicted_planted_amount: null,
          error: 'Prediction service unavailable'
        });
      }
    }

    res.json({ region, predictions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

module.exports = router;
