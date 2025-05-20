const dashboardRoutes = require('./routes/dashboardRoutes');

// Routes
app.use('/api/farmers', farmerRoutes);
app.use('/api/dashboard', dashboardRoutes);
// ... other routes ... 