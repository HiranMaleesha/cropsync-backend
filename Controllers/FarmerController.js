const Farmer = require('../Model/FarmerModel');

// Get all farmers
const getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find();
    res.status(200).json(farmers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching farmers' });
  }
};

// Get farmer by ID
const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    res.status(200).json(farmer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching farmer' });
  }
};

// Create new farmer
const createFarmer = async (req, res) => {
  try {
    const { farmerName, idNumber, phoneNumber, region, crops } = req.body;
    
    // Check if farmer with same ID number exists
    const existingFarmer = await Farmer.findOne({ idNumber });
    if (existingFarmer) {
      return res.status(400).json({ message: 'Farmer with this ID number already exists' });
    }

    const farmer = new Farmer({
      farmerName,
      idNumber,
      phoneNumber,
      region,
      crops
    });

    const savedFarmer = await farmer.save();
    res.status(201).json({ message: 'Farmer registered successfully', farmer: savedFarmer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating farmer' });
  }
};

// Update farmer
const updateFarmer = async (req, res) => {
  try {
    const { farmerName, phoneNumber, region, crops } = req.body;
    
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Update fields
    farmer.farmerName = farmerName || farmer.farmerName;
    farmer.phoneNumber = phoneNumber || farmer.phoneNumber;
    farmer.region = region || farmer.region;
    if (crops) farmer.crops = crops;

    const updatedFarmer = await farmer.save();
    res.status(200).json({ message: 'Farmer updated successfully', farmer: updatedFarmer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating farmer' });
  }
};

// Delete farmer
const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    res.status(200).json({ message: 'Farmer deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting farmer' });
  }
};

module.exports = {
  getAllFarmers,
  getFarmerById,
  createFarmer,
  updateFarmer,
  deleteFarmer
}; 