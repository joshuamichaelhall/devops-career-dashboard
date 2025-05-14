/**
 * Demo Mode Configuration
 * 
 * This module provides demo mode functionality for the dashboard,
 * including demo authentication and data handling.
 */
const fs = require('fs-extra');
const path = require('path');
const jwt = require('jsonwebtoken');

// Demo data path
const DEMO_DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'demo-data.json');

// Demo user credentials - publicly available for the demo
const DEMO_USER = {
  username: 'demo',
  password: 'demopassword',
  isAdmin: true
};

// JWT settings for demo mode
const DEMO_JWT_SECRET = 'demo-mode-jwt-secret-not-for-production';
const DEMO_TOKEN_EXPIRY = '24h';

/**
 * Generate a JWT token for the demo user
 * @returns {string} JWT token
 */
const generateDemoToken = () => {
  return jwt.sign(
    { 
      username: DEMO_USER.username,
      isAdmin: DEMO_USER.isAdmin,
      isDemoUser: true
    },
    DEMO_JWT_SECRET,
    { expiresIn: DEMO_TOKEN_EXPIRY }
  );
};

/**
 * Verify a demo user's credentials
 * @param {string} username - Username to verify
 * @param {string} password - Password to verify
 * @returns {Object|null} User object if authenticated, null otherwise
 */
const verifyDemoCredentials = (username, password) => {
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    return {
      username: DEMO_USER.username,
      isAdmin: DEMO_USER.isAdmin,
      isDemoUser: true
    };
  }
  return null;
};

/**
 * Middleware to validate demo mode JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateDemoToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, DEMO_JWT_SECRET);
    
    // Ensure it's a demo token
    if (!decoded.isDemoUser) {
      throw new Error('Not a demo token');
    }
    
    // Add user info to request
    req.user = decoded;
    
    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    console.error('Demo token verification error:', error);
    return res.status(401).json({ error: 'Invalid or expired demo token' });
  }
};

/**
 * Get the demo data
 * @returns {Object} Demo dashboard data
 */
const getDemoData = () => {
  try {
    const data = fs.readJsonSync(DEMO_DATA_PATH);
    return data;
  } catch (error) {
    console.error('Error reading demo data:', error);
    return {};
  }
};

/**
 * Configure express app for demo mode
 * @param {Object} app - Express app instance
 */
const configureDemoMode = (app) => {
  console.log('Configuring dashboard in DEMO mode');
  
  // Demo authentication endpoint
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = verifyDemoCredentials(username, password);
    
    if (user) {
      // Generate token
      const token = generateDemoToken();
      
      return res.json({
        success: true,
        token,
        username: user.username,
        isAdmin: user.isAdmin,
        isDemoUser: true,
        message: 'Welcome to the demo dashboard!'
      });
    } else {
      // Provide hint for demo credentials
      return res.status(401).json({
        error: 'Invalid credentials. Try using username: "demo" and password: "demopassword"'
      });
    }
  });
  
  // Auto-login endpoint for demo
  app.get('/api/auth/demo-login', (req, res) => {
    const token = generateDemoToken();
    
    return res.json({
      success: true,
      token,
      username: DEMO_USER.username,
      isAdmin: DEMO_USER.isAdmin,
      isDemoUser: true,
      message: 'Auto-logged in as demo user'
    });
  });
  
  // Verify token endpoint
  app.get('/api/auth/verify', validateDemoToken, (req, res) => {
    res.json({
      authenticated: true,
      user: {
        username: req.user.username,
        isAdmin: req.user.isAdmin,
        isDemoUser: true
      }
    });
  });
  
  // Data endpoints
  app.get('/api/data', validateDemoToken, (req, res) => {
    try {
      const data = getDemoData();
      res.json(data);
    } catch (error) {
      console.error('Error reading demo data:', error);
      res.status(500).json({ error: 'Failed to read demo dashboard data' });
    }
  });
  
  // For all modification endpoints, return success but don't change data
  app.put('/api/data', validateDemoToken, (req, res) => {
    // In demo mode, pretend to update but don't actually change anything
    res.json({ 
      success: true, 
      demoMode: true,
      message: 'In demo mode, data changes are not persisted'
    });
  });
  
  app.patch('/api/data/:section', validateDemoToken, (req, res) => {
    const { section } = req.params;
    // Get the current data to return the current section
    const data = getDemoData();
    
    if (!data[section]) {
      return res.status(404).json({ error: `Section '${section}' not found` });
    }
    
    res.json({ 
      success: true, 
      demoMode: true,
      data: data[section],
      message: 'In demo mode, data changes are not persisted'
    });
  });
  
  // Handle all other API routes
  app.use('/api/*', validateDemoToken, (req, res) => {
    if (req.method === 'GET') {
      // For GET requests, we should have handled them above
      // If we get here, it's an unknown endpoint
      return res.status(404).json({ error: 'API endpoint not found' });
    } else {
      // For any data modification request, return success but don't modify
      return res.json({ 
        success: true, 
        demoMode: true,
        message: 'In demo mode, data changes are not persisted'
      });
    }
  });
};

module.exports = {
  configureDemoMode,
  getDemoData,
  DEMO_USER
};