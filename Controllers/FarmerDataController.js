const FarmerData = require('../Model/FarmerDataModel');
const Farmer = require('../Model/FarmerModel');

// Get all farmer data
const getAllFarmerData = async (req, res) => {
  try {
    const data = await FarmerData.find().populate('farmerId', 'farmerName idNumber');
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching farmer data' });
  }
};

// Get farmer data by ID
const getFarmerDataById = async (req, res) => {
  try {
    const data = await FarmerData.findById(req.params.id).populate('farmerId', 'farmerName idNumber');
    if (!data) {
      return res.status(404).json({ message: 'Farmer data not found' });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching farmer data' });
  }
};

// Create new farmer data
const createFarmerData = async (req, res) => {
  try {
    const {
      farmerId,
      farmerName,
      cropName,
      area,
      planted,
      harvested,
      wasted,
      harvestShortfall,
      yield: cropYield,
      pricePerKilo,
      season,
      region,
      notes
    } = req.body;

    // Verify farmer exists
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Verify crop exists in farmer's profile
    const cropExists = farmer.crops.some(crop => crop.name === cropName);
    if (!cropExists) {
      return res.status(400).json({ message: 'Selected crop is not registered for this farmer' });
    }

    const farmerData = new FarmerData({
      farmerId,
      farmerName,
      cropName,
      area,
      planted,
      harvested,
      wasted,
      harvestShortfall,
      yield: cropYield,
      pricePerKilo,
      season,
      region,
      notes
    });

    const savedData = await farmerData.save();
    res.status(201).json({ message: 'Farmer data saved successfully', data: savedData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving farmer data' });
  }
};

// Update farmer data
const updateFarmerData = async (req, res) => {
  try {
    const {
      cropName,
      area,
      yield: cropYield,
      pricePerKilo,
      season,
      region,
      notes
    } = req.body;

    const farmerData = await FarmerData.findById(req.params.id);
    if (!farmerData) {
      return res.status(404).json({ message: 'Farmer data not found' });
    }

    // Update fields
    farmerData.cropName = cropName || farmerData.cropName;
    farmerData.area = area || farmerData.area;
    farmerData.yield = cropYield || farmerData.yield;
    farmerData.pricePerKilo = pricePerKilo || farmerData.pricePerKilo;
    farmerData.season = season || farmerData.season;
    farmerData.region = region || farmerData.region;
    if (notes !== undefined) farmerData.notes = notes;

    const updatedData = await farmerData.save();
    res.status(200).json({ message: 'Farmer data updated successfully', data: updatedData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating farmer data' });
  }
};

// Delete farmer data
const deleteFarmerData = async (req, res) => {
  try {
    const farmerData = await FarmerData.findByIdAndDelete(req.params.id);
    if (!farmerData) {
      return res.status(404).json({ message: 'Farmer data not found' });
    }
    res.status(200).json({ message: 'Farmer data deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting farmer data' });
  }
};

// Get all farmers for dropdown
const getFarmersForDropdown = async (req, res) => {
  try {
    const farmers = await Farmer.find().select('_id farmerName idNumber region crops');
    res.status(200).json(farmers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching farmers for dropdown' });
  }
};

// Get analytics data with filters
const getAnalyticsData = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      region,
      cropName,
      season
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (region) filter.region = region;
    if (cropName) filter.cropName = cropName;
    if (season) filter.season = season;

    // Get aggregated data
    const analyticsData = await FarmerData.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalHarvested: { $sum: "$harvested" },
          totalYield: { $sum: "$yield" },
          totalArea: { $sum: "$area" },
          totalRevenue: { $sum: { $multiply: ["$harvested", "$pricePerKilo"] } },
          averagePrice: { $avg: "$pricePerKilo" },
          totalWasted: { $sum: "$wasted" },
          totalShortfall: { $sum: "$harvestShortfall" },
          totalPlanted: { $sum: "$planted" },
          recordCount: { $sum: 1 }
        }
      }
    ]);

    // Get unique values for filters
    const regions = await FarmerData.distinct('region');
    const crops = await FarmerData.distinct('cropName');
    const seasons = await FarmerData.distinct('season');

    // Get monthly trends
    const monthlyTrends = await FarmerData.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          harvested: { $sum: "$harvested" },
          yield: { $sum: "$yield" },
          area: { $sum: "$area" },
          revenue: { $sum: { $multiply: ["$harvested", "$pricePerKilo"] } }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json({
      summary: analyticsData[0] || {
        totalHarvested: 0,
        totalYield: 0,
        totalArea: 0,
        totalRevenue: 0,
        averagePrice: 0,
        totalWasted: 0,
        totalShortfall: 0,
        totalPlanted: 0,
        recordCount: 0
      },
      filters: {
        regions,
        crops,
        seasons
      },
      monthlyTrends
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
};

module.exports = {
  getAllFarmerData,
  getFarmerDataById,
  createFarmerData,
  updateFarmerData,
  deleteFarmerData,
  getFarmersForDropdown,
  getAnalyticsData
}; 