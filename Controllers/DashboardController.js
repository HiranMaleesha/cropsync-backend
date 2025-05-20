const Farmer = require('../Model/FarmerModel');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total number of farmers
    const totalFarmers = await Farmer.countDocuments();

    // Get all farmers to calculate other statistics
    const farmers = await Farmer.find();

    // Calculate total area of all crops
    const totalCropArea = farmers.reduce((total, farmer) => {
      return total + farmer.crops.reduce((farmerTotal, crop) => farmerTotal + crop.area, 0);
    }, 0);

    // Get unique crops and their total areas
    const cropStats = farmers.reduce((stats, farmer) => {
      farmer.crops.forEach(crop => {
        if (!stats[crop.name]) {
          stats[crop.name] = 0;
        }
        stats[crop.name] += crop.area;
      });
      return stats;
    }, {});

    // Convert crop stats to array and sort by area
    const cropDistribution = Object.entries(cropStats)
      .map(([name, area]) => ({ name, area }))
      .sort((a, b) => b.area - a.area);

    // Get farmers by region
    const regionStats = farmers.reduce((stats, farmer) => {
      if (!stats[farmer.region]) {
        stats[farmer.region] = 0;
      }
      stats[farmer.region]++;
      return stats;
    }, {});

    // Convert region stats to array
    const regionDistribution = Object.entries(regionStats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Get recent farmers (last 5)
    const recentFarmers = await Farmer.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('farmerName region crops createdAt');

    res.status(200).json({
      totalFarmers,
      totalCropArea,
      cropDistribution,
      regionDistribution,
      recentFarmers,
      // Additional statistics
      averageCropsPerFarmer: totalFarmers > 0 
        ? farmers.reduce((total, farmer) => total + farmer.crops.length, 0) / totalFarmers 
        : 0,
      totalUniqueCrops: Object.keys(cropStats).length,
      totalRegions: Object.keys(regionStats).length
    });
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};

module.exports = {
  getDashboardStats
}; 