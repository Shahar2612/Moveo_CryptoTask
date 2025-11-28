require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// import routes
const authRoutes = require('./routes/authRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// connect to database
connectDB();


const app = express();

// middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'server is running',
    timestamp: new Date().toISOString(),
  });
});

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'route not found',
  });
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
  console.log(`environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

