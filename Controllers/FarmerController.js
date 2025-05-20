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
    const { farmerName, idNumber, phoneNumber, region, email, firebaseUid, crops } = req.body;
    
    // Validate required fields
    if (!farmerName || !idNumber || !phoneNumber || !region || !email || !firebaseUid || !crops) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['farmerName', 'idNumber', 'phoneNumber', 'region', 'email', 'firebaseUid', 'crops']
      });
    }

    // Check if farmer with same ID number exists
    const existingFarmerById = await Farmer.findOne({ idNumber });
    if (existingFarmerById) {
      return res.status(400).json({ message: 'Farmer with this ID number already exists' });
    }

    // Check if farmer with same email exists
    const existingFarmerByEmail = await Farmer.findOne({ email });
    if (existingFarmerByEmail) {
      return res.status(400).json({ message: 'Farmer with this email already exists' });
    }

    // Check if farmer with same Firebase UID exists
    const existingFarmerByUid = await Farmer.findOne({ firebaseUid });
    if (existingFarmerByUid) {
      return res.status(400).json({ message: 'Farmer with this Firebase UID already exists' });
    }

    // Create new farmer
    const farmer = new Farmer({
      farmerName,
      idNumber,
      phoneNumber,
      region,
      email,
      firebaseUid,
      crops: crops.map(crop => ({
        name: crop.name,
        area: Number(crop.area)
      }))
    });

    const savedFarmer = await farmer.save();
    res.status(201).json({ 
      message: 'Farmer registered successfully', 
      farmer: savedFarmer 
    });
  } catch (err) {
    console.error('Error creating farmer:', err);
    // Send more detailed error message
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate key error', 
        field: Object.keys(err.keyPattern)[0]
      });
    }
    res.status(500).json({ 
      message: 'Error creating farmer',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
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

// Check if farmer exists by Firebase UID
const checkFarmerByUid = async (req, res) => {
  try {
    const { uid } = req.params;
    const farmer = await Farmer.findOne({ firebaseUid: uid });
    res.json({ exists: !!farmer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error checking farmer' });
  }
};

// Get farmer by email
const getFarmerByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const farmer = await Farmer.findOne({ email });
    
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    res.status(200).json(farmer);
  } catch (error) {
    console.error("Error fetching farmer by email:", error);
    res.status(500).json({ message: "Error fetching farmer profile" });
  }
};

module.exports = {
  getAllFarmers,
  getFarmerById,
  createFarmer,
  updateFarmer,
  deleteFarmer,
  checkFarmerByUid,
  getFarmerByEmail,
}; 