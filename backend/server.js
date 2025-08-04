const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { connectRedis } = require('./config/redis');
const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');
const aiRoutes = require('./routes/ai');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Accio Backend API is running!',
    status: 'OK', 
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      sessions: '/api/sessions',
      ai: '/api/ai'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: 'The requested endpoint does not exist',
    availableEndpoints: {
      root: '/',
      health: '/health',
      auth: '/api/auth',
      sessions: '/api/sessions',
      ai: '/api/ai'
    }
  });
});

// Connect to MongoDB and Redis
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acciojob_assignment';

console.log('🔍 Attempting to connect to MongoDB...');
console.log('📡 MongoDB URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('🌐 Database:', mongoose.connection.db.databaseName);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('🔧 Please check your MONGODB_URI environment variable');
    console.error('🔧 Make sure MongoDB Atlas is properly configured');
  });

connectRedis();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});