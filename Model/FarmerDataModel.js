const mongoose = require('mongoose');

const farmerDataSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  farmerName: {
    type: String,
    required: true
  },
  cropName: {
    type: String,
    required: true
  },
  area: {
    type: Number,
    required: true
  },
  planted: {
    type: Number,
    required: true,
    default: 0
  },
  harvested: {
    type: Number,
    required: true,
    default: 0
  },
  wasted: {
    type: Number,
    required: true,
    default: 0
  },
  harvestShortfall: {
    type: Number,
    required: true,
    default: 0
  },
  yield: {
    type: Number,
    required: true
  },
  pricePerKilo: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  season: {
    type: String,
    required: true,
    enum: ['Yala', 'Maha']
  },
  region: {
    type: String,
    required: true
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FarmerData', farmerDataSchema); 