const redis = require('redis');

// Create Redis client with optional connection
let client = null;

const createRedisClient = () => {
  if (!client) {
    client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    client.on('connect', () => {
      console.log('Redis connected');
    });
  }
  return client;
};

const connectRedis = async () => {
  try {
    // For local development, skip Redis entirely
    console.log('Redis disabled for local development - running without caching');
  } catch (error) {
    console.log('Redis not available - continuing without caching');
  }
};

// Mock Redis functions for development
const mockRedis = {
  get: async () => null,
  setEx: async () => 'OK',
  del: async () => 0
};

const getClient = () => {
  // Always return mock Redis for local development
  return mockRedis;
};

module.exports = { client: getClient(), connectRedis }; 