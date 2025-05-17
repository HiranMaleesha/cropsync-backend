const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  farmerName: {
    type: String,
    required: true
  },
  idNumber: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true,
    enum: ['Northern', 'Eastern', 'Western', 'Southern', 'Central']
  },
  crops: [{
    name: {
      type: String,
      required: true
    },
    area: {
      type: Number,
      required: true
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Farmer', farmerSchema); 