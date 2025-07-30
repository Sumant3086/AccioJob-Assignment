const express = require('express');
const Session = require('../models/Session');
const auth = require('../middleware/auth');
const { client } = require('../config/redis');
const router = express.Router();

// Get all sessions for user
router.get('/', auth, async (req, res) => {
  try {
    // Try to get from cache first (if Redis is available)
    try {
      const cacheKey = `sessions:${req.user._id}`;
      const cachedSessions = await client.get(cacheKey);
      
      if (cachedSessions) {
        return res.json(JSON.parse(cachedSessions));
      }
    } catch (cacheError) {
      console.log('Cache not available, fetching from database');
    }
    
    const sessions = await Session.find({ userId: req.user._id })
      .select('name createdAt updatedAt')
      .sort({ updatedAt: -1 });
    
    // Cache for 5 minutes (if Redis is available)
    try {
      const cacheKey = `sessions:${req.user._id}`;
      await client.setEx(cacheKey, 300, JSON.stringify(sessions));
    } catch (cacheError) {
      console.log('Cache not available');
    }
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new session
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const session = new Session({
      userId: req.user._id,
      name: name || `Session ${Date.now()}`,
      messages: [],
      currentCode: { jsx: '', css: '' }
    });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific session
router.get('/:id', auth, async (req, res) => {
  try {
    // Try to get from cache first (if Redis is available)
    try {
      const cacheKey = `session:${req.params.id}`;
      const cachedSession = await client.get(cacheKey);
      
      if (cachedSession) {
        const session = JSON.parse(cachedSession);
        // Verify user ownership
        if (session.userId === req.user._id.toString()) {
          return res.json(session);
        }
      }
    } catch (cacheError) {
      console.log('Cache not available, fetching from database');
    }
    
    const session = await Session.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Cache for 10 minutes (if Redis is available)
    try {
      const cacheKey = `session:${req.params.id}`;
      await client.setEx(cacheKey, 600, JSON.stringify(session));
    } catch (cacheError) {
      console.log('Cache not available');
    }
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update session (auto-save)
router.put('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Clear cache for this user's sessions (if Redis is available)
    try {
      const cacheKey = `sessions:${req.user._id}`;
      await client.del(cacheKey);
      
      // Cache the updated session
      const sessionCacheKey = `session:${req.params.id}`;
      await client.setEx(sessionCacheKey, 600, JSON.stringify(session));
    } catch (cacheError) {
      console.log('Cache not available');
    }
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;