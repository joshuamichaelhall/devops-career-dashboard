/**
 * Authentication utilities for the dashboard server
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs-extra');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// JWT secret key - use environment variable or default (in development only)
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key-change-in-production';

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// Token expiration time (24 hours)
const TOKEN_EXPIRY = '24h';

/**
 * Generate a JWT token for authenticated user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      username: user.username,
      isAdmin: user.isAdmin 
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

/**
 * Verify user credentials for login
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Object|null} User object if authenticated, null otherwise
 */
const verifyCredentials = async (username, password) => {
  // For initial setup, check if we're using default credentials
  if (!ADMIN_PASSWORD_HASH && process.env.NODE_ENV === 'development') {
    // In development mode with no password hash, allow default credentials
    if (username === 'admin' && password === 'admin') {
      return {
        username: 'admin',
        isAdmin: true
      };
    }
    return null;
  }

  // Regular authentication flow
  if (username === ADMIN_USERNAME) {
    // Verify password hash
    try {
      const passwordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
      
      if (passwordValid) {
        return {
          username: ADMIN_USERNAME,
          isAdmin: true
        };
      }
    } catch (error) {
      console.error('Error verifying password:', error);
    }
  }
  
  return null;
};

/**
 * Authentication middleware for protected routes
 */
const requireAuth = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user info to request
    req.user = decoded;
    
    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Admin authorization middleware
 * Requires the requireAuth middleware to be used first
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  
  next();
};

/**
 * Generate a salt and hash for a password
 * Utility function for initial setup
 * @param {string} password - Password to hash
 * @returns {string} Hashed password
 */
const generatePasswordHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports = {
  generateToken,
  verifyCredentials,
  requireAuth,
  requireAdmin,
  generatePasswordHash
};