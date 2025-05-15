/**
 * Demo server for DevOps Career Dashboard
 */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs-extra');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Load environment variables
require('dotenv').config();

// Import demo data
const DEMO_DATA = require('./dashboard/src/data/demo-data.json');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Enable gzip compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Basic middleware
app.use(cors());
app.use(bodyParser.json());

// Configure the server for demo mode
// API routes for demo mode
app.get('/api/demo', (req, res) => {
  res.json({ message: 'Demo API is working!' });
});

// Auth routes with demo credentials
app.post('/api/auth/login', (req, res) => {
  // Always authenticate in demo mode
  res.json({
    success: true,
    token: 'demo-token-xyz',
    user: {
      id: 'demo-user',
      username: 'demo',
      role: 'demo-user'
    }
  });
});

// Data routes
app.get('/api/dashboard/data', (req, res) => {
  // Force all requests to return demo data with proper structure
  res.json(DEMO_DATA);
});

// Also serve demo data from the base API endpoint for compatibility
app.get('/api/data', (req, res) => {
  res.json(DEMO_DATA);
});

// Skills routes
app.get('/api/skills', (req, res) => {
  res.json(DEMO_DATA.skills);
});

// Learning resources routes
app.get('/api/resources', (req, res) => {
  res.json(DEMO_DATA.resources);
});

// Tasks routes
app.get('/api/tasks', (req, res) => {
  res.json(DEMO_DATA.tasks);
});

// Metrics routes
app.get('/api/metrics', (req, res) => {
  res.json(DEMO_DATA.metrics);
});

// Handle any attempt to modify data
app.post('/api/*', (req, res) => {
  res.json({
    success: true,
    message: 'This is a read-only demo. Data modifications are not saved.'
  });
});

app.put('/api/*', (req, res) => {
  res.json({
    success: true,
    message: 'This is a read-only demo. Data modifications are not saved.'
  });
});

app.delete('/api/*', (req, res) => {
  res.json({
    success: true,
    message: 'This is a read-only demo. Data modifications are not saved.'
  });
});

// Serve static build files if they exist
const buildPath = path.join(__dirname, 'dashboard/build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));

  // All other GET requests not handled will return the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  app.get('*', (req, res) => {
    res.json({
      error: 'Build directory not found. Please run npm run build first.'
    });
  });
}

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Demo server running on port ${PORT}`);
  console.log(`Demo URL: https://devops-dashboard.onrender.com`);
});