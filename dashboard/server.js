const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import utilities
const { generateToken, verifyCredentials, requireAuth, requireAdmin } = require('./server/authUtils');
const { getClayApiKey, setClayApiKey, getClayConnectionStatus, setClayConnectionStatus, migrateFromLegacyConfig } = require('./server/keyManager');
const { createBackup, importData, exportData, getTemplates, getTemplate, getBackups, restoreBackup } = require('./server/dataManager');
const { syncData } = require('./server/cloudSync');

const app = express();
const PORT = process.env.PORT || 3001;

// Clay API URL from environment variables
const CLAY_API_URL = process.env.CLAY_API_URL || 'https://api.clay.com/v1';

// Security configurations
const ENABLE_RATE_LIMITING = process.env.ENABLE_RATE_LIMITING === 'true';
const MAX_REQUESTS_PER_15_MIN = parseInt(process.env.MAX_REQUESTS_PER_15_MIN || '100');
const REQUIRE_HTTPS = process.env.REQUIRE_HTTPS === 'true';

// Security middleware
app.use(helmet());

// Rate limiting
if (ENABLE_RATE_LIMITING) {
  // Apply general rate limiting
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: MAX_REQUESTS_PER_15_MIN, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
  }));
  
  // Stricter rate limiting for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 login attempts per windowMs
    message: 'Too many login attempts from this IP, please try again later'
  });
  
  // Apply auth rate limiter to login endpoint
  app.use('/api/auth/login', authLimiter);
}

// HTTPS enforcement middleware
if (REQUIRE_HTTPS && process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Basic middleware
app.use(cors());
app.use(bodyParser.json());

// Data file paths
const DATA_PATH = path.join(__dirname, 'src', 'data', 'data.json');
const DATA_BACKUP_DIR = path.join(__dirname, 'src', 'data', 'backups');
const CLAY_CONFIG_PATH = path.join(__dirname, 'src', 'data', 'clay-config.json');

// Ensure backup directory exists
fs.ensureDirSync(DATA_BACKUP_DIR);

// Helper function to create a backup before writing
const backupDataFile = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(DATA_BACKUP_DIR, `data-${timestamp}.json`);
  await fs.copy(DATA_PATH, backupPath);
  
  // Clean up old backups (keep only the last 10)
  const files = await fs.readdir(DATA_BACKUP_DIR);
  const backupFiles = files.filter(file => file.startsWith('data-')).sort();
  
  if (backupFiles.length > 10) {
    const filesToDelete = backupFiles.slice(0, backupFiles.length - 10);
    for (const file of filesToDelete) {
      await fs.remove(path.join(DATA_BACKUP_DIR, file));
    }
  }
};

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Verify credentials
    const user = await verifyCredentials(username, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    res.json({
      success: true,
      token,
      username: user.username,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Verify token endpoint
app.get('/api/auth/verify', requireAuth, (req, res) => {
  res.json({
    authenticated: true,
    user: {
      username: req.user.username,
      isAdmin: req.user.isAdmin
    }
  });
});

// Protected data routes
app.get('/api/data', requireAuth, async (req, res) => {
  try {
    const data = await fs.readJson(DATA_PATH);
    res.json(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    res.status(500).json({ error: 'Failed to read dashboard data' });
  }
});

app.put('/api/data', requireAuth, requireAdmin, async (req, res) => {
  try {
    // Create a backup first
    await backupDataFile();
    
    // Update the data file
    await fs.writeJson(DATA_PATH, req.body, { spaces: 2 });
    res.json({ success: true });
  } catch (error) {
    console.error('Error writing data file:', error);
    res.status(500).json({ error: 'Failed to update dashboard data' });
  }
});

// Endpoint to update specific sections
app.patch('/api/data/:section', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { section } = req.params;
    const updates = req.body;
    
    // Read current data
    const data = await fs.readJson(DATA_PATH);
    
    // Backup before modifying
    await backupDataFile();
    
    // Update only the specified section
    if (!data[section]) {
      return res.status(404).json({ error: `Section '${section}' not found` });
    }
    
    // Update the section with the new data
    data[section] = updates;
    
    // Write updated data back to file
    await fs.writeJson(DATA_PATH, data, { spaces: 2 });
    
    res.json({ success: true, data: data[section] });
  } catch (error) {
    console.error(`Error updating ${req.params.section}:`, error);
    res.status(500).json({ error: `Failed to update ${req.params.section}` });
  }
});

// Task-specific endpoints
app.patch('/api/tasks/:taskId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { completed } = req.body;
    
    // Read current data
    const data = await fs.readJson(DATA_PATH);
    await backupDataFile();
    
    // Find and update the task
    const taskIndex = data.goals.findIndex(task => task.content === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    data.goals[taskIndex].completed = completed;
    
    // Update stats if completing a task
    if (completed) {
      data.overview.completedGoals++;
      data.overview.goalCompletionRate = Math.round(
        (data.overview.completedGoals / data.overview.totalGoals) * 100
      );
    }
    
    // Write updated data
    await fs.writeJson(DATA_PATH, data, { spaces: 2 });
    
    res.json({ success: true, task: data.goals[taskIndex] });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Time tracking endpoints
app.post('/api/time-log', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { category, hours, date } = req.body;
    
    if (!category || !hours || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Read current data
    const data = await fs.readJson(DATA_PATH);
    await backupDataFile();
    
    // Update weekly metrics
    const categoryKey = `${category.toLowerCase()}Hours`;
    if (data.weeklyMetrics[categoryKey] !== undefined) {
      data.weeklyMetrics[categoryKey] += parseInt(hours);
      data.weeklyMetrics.totalHours += parseInt(hours);
    } else {
      return res.status(400).json({ error: 'Invalid category' });
    }
    
    // Write updated data
    await fs.writeJson(DATA_PATH, data, { spaces: 2 });
    
    res.json({ success: true, metrics: data.weeklyMetrics });
  } catch (error) {
    console.error('Error logging time:', error);
    res.status(500).json({ error: 'Failed to log time' });
  }
});

// Learning resources endpoints
app.get('/api/learning-resources', requireAuth, async (req, res) => {
  try {
    const data = await fs.readJson(DATA_PATH);
    res.json(data.learningResources || []);
  } catch (error) {
    console.error('Error fetching learning resources:', error);
    res.status(500).json({ error: 'Failed to fetch learning resources' });
  }
});

app.post('/api/learning-resources', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, type, priority, targetMonth, status = 'Scheduled' } = req.body;
    
    if (!name || !type || !priority || !targetMonth) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Read current data
    const data = await fs.readJson(DATA_PATH);
    await backupDataFile();
    
    // Ensure learningResources array exists
    if (!data.learningResources) {
      data.learningResources = [];
    }
    
    // Generate a unique ID for the new resource
    const id = Date.now().toString();
    
    // Create new resource object
    const newResource = {
      id,
      name,
      type,
      priority,
      targetMonth,
      status,
      progress: 0,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    // Add to the array
    data.learningResources.push(newResource);
    
    // Write updated data
    await fs.writeJson(DATA_PATH, data, { spaces: 2 });
    
    res.json({ success: true, resource: newResource });
  } catch (error) {
    console.error('Error adding learning resource:', error);
    res.status(500).json({ error: 'Failed to add learning resource' });
  }
});

app.patch('/api/learning-resources/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Read current data
    const data = await fs.readJson(DATA_PATH);
    await backupDataFile();
    
    // Find the resource
    const resourceIndex = data.learningResources.findIndex(resource => resource.id === id);
    
    if (resourceIndex === -1) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    // Update the resource
    data.learningResources[resourceIndex] = {
      ...data.learningResources[resourceIndex],
      ...updates
    };
    
    // Write updated data
    await fs.writeJson(DATA_PATH, data, { spaces: 2 });
    
    res.json({ success: true, resource: data.learningResources[resourceIndex] });
  } catch (error) {
    console.error('Error updating learning resource:', error);
    res.status(500).json({ error: 'Failed to update learning resource' });
  }
});

// Run update scripts
app.post('/api/update-dashboard', requireAuth, requireAdmin, async (req, res) => {
  try {
    // Run the update-dashboard.sh script
    const scriptPath = path.join(__dirname, 'scripts', 'update-dashboard.sh');
    
    const process = spawn(scriptPath, [], {
      shell: true,
      cwd: __dirname
    });
    
    let outputData = '';
    let errorData = '';
    
    process.stdout.on('data', (data) => {
      outputData += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      errorData += data.toString();
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        res.json({ success: true, output: outputData });
      } else {
        res.status(500).json({ error: 'Script execution failed', details: errorData });
      }
    });
  } catch (error) {
    console.error('Error running update script:', error);
    res.status(500).json({ error: 'Failed to run update script' });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Clay CRM API endpoints
// Clay API URL is defined at the top from environment variables

// Migrate from old Clay config file if it exists
try {
  // Check if old config file exists and migrate to encrypted storage
  migrateFromLegacyConfig(CLAY_CONFIG_PATH);
} catch (error) {
  console.error('Error during Clay config migration:', error);
}

// Note: getClayApiKey is now imported from keyManager.js

// Clay CRM connection status
app.get('/api/clay/status', requireAuth, async (req, res) => {
  try {
    const apiKey = getClayApiKey();
    const connectionStatus = getClayConnectionStatus();
    
    // If not connected, return status without checking API
    if (!connectionStatus.connected || !apiKey) {
      return res.json({
        connected: false,
        lastConnected: connectionStatus.lastConnected
      });
    }
    
    // Check connection with Clay API
    try {
      const response = await axios.get(`${CLAY_API_URL}/status`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000 // 5 second timeout
      });
      
      if (response.status === 200) {
        return res.json({
          connected: true,
          lastConnected: connectionStatus.lastConnected,
          status: response.data
        });
      } else {
        throw new Error('Failed to connect to Clay API');
      }
    } catch (apiError) {
      console.error('Clay API connection check failed:', apiError);
      
      // If API check fails, update status
      setClayConnectionStatus(false);
      
      return res.json({
        connected: false,
        lastConnected: connectionStatus.lastConnected,
        error: apiError.message
      });
    }
  } catch (error) {
    console.error('Error checking Clay connection status:', error);
    res.status(500).json({ error: 'Failed to check Clay connection status' });
  }
});

// Connect to Clay CRM with API key
app.post('/api/clay/connect', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }
    
    // Test connection with the API key
    try {
      const response = await axios.get(`${CLAY_API_URL}/status`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000 // 5 second timeout
      });
      
      if (response.status === 200) {
        // Store API key securely
        setClayApiKey(apiKey);
        setClayConnectionStatus(true);
        
        return res.json({
          success: true,
          connected: true,
          message: 'Successfully connected to Clay CRM'
        });
      } else {
        throw new Error('Failed to connect to Clay API');
      }
    } catch (apiError) {
      console.error('Clay API connection failed:', apiError);
      return res.status(401).json({
        success: false,
        error: 'Failed to authenticate with Clay API. Please check your API key.'
      });
    }
  } catch (error) {
    console.error('Error connecting to Clay CRM:', error);
    res.status(500).json({ error: 'Failed to connect to Clay CRM' });
  }
});

// Fetch connections from Clay CRM
app.get('/api/clay/connections', requireAuth, async (req, res) => {
  try {
    const apiKey = getClayApiKey();
    
    if (!apiKey) {
      return res.status(401).json({ error: 'Not connected to Clay CRM' });
    }
    
    const limit = req.query.limit || 50;
    const offset = req.query.offset || 0;
    
    try {
      const response = await axios.get(`${CLAY_API_URL}/connections?limit=${limit}&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      // For demo purposes, if Clay API is not available, return mock data
      if (process.env.NODE_ENV === 'development') {
        const mockConnections = generateMockConnections(limit);
        return res.json(mockConnections);
      }
      
      return res.json(response.data);
    } catch (apiError) {
      console.error('Error fetching Clay connections:', apiError);
      
      if (process.env.NODE_ENV === 'development') {
        const mockConnections = generateMockConnections(limit);
        return res.json(mockConnections);
      }
      
      return res.status(500).json({ error: 'Failed to fetch connections from Clay CRM' });
    }
  } catch (error) {
    console.error('Error in Clay connections endpoint:', error);
    res.status(500).json({ error: 'Failed to process Clay connections request' });
  }
});

// Fetch activities from Clay CRM
app.get('/api/clay/activities', requireAuth, async (req, res) => {
  try {
    const apiKey = getClayApiKey();
    
    if (!apiKey) {
      return res.status(401).json({ error: 'Not connected to Clay CRM' });
    }
    
    const limit = req.query.limit || 20;
    
    try {
      const response = await axios.get(`${CLAY_API_URL}/activities?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      // For demo purposes, if Clay API is not available, return mock data
      if (process.env.NODE_ENV === 'development') {
        const mockActivities = generateMockActivities(limit);
        return res.json(mockActivities);
      }
      
      return res.json(response.data);
    } catch (apiError) {
      console.error('Error fetching Clay activities:', apiError);
      
      if (process.env.NODE_ENV === 'development') {
        const mockActivities = generateMockActivities(limit);
        return res.json(mockActivities);
      }
      
      return res.status(500).json({ error: 'Failed to fetch activities from Clay CRM' });
    }
  } catch (error) {
    console.error('Error in Clay activities endpoint:', error);
    res.status(500).json({ error: 'Failed to process Clay activities request' });
  }
});

// Fetch networking metrics from Clay CRM
app.get('/api/clay/metrics', requireAuth, async (req, res) => {
  try {
    const apiKey = getClayApiKey();
    
    if (!apiKey) {
      return res.status(401).json({ error: 'Not connected to Clay CRM' });
    }
    
    try {
      const response = await axios.get(`${CLAY_API_URL}/metrics`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      // For demo purposes, if Clay API is not available, return mock data
      if (process.env.NODE_ENV === 'development') {
        const mockMetrics = {
          newConnections: 12,
          connectionAcceptanceRate: 68,
          contentPieces: 1,
          engagementRate: 24,
          followUpsSent: 8,
          responseRate: 42
        };
        return res.json(mockMetrics);
      }
      
      return res.json(response.data);
    } catch (apiError) {
      console.error('Error fetching Clay metrics:', apiError);
      
      if (process.env.NODE_ENV === 'development') {
        const mockMetrics = {
          newConnections: 12,
          connectionAcceptanceRate: 68,
          contentPieces: 1,
          engagementRate: 24,
          followUpsSent: 8,
          responseRate: 42
        };
        return res.json(mockMetrics);
      }
      
      return res.status(500).json({ error: 'Failed to fetch metrics from Clay CRM' });
    }
  } catch (error) {
    console.error('Error in Clay metrics endpoint:', error);
    res.status(500).json({ error: 'Failed to process Clay metrics request' });
  }
});

// Fetch upcoming follow-ups from Clay CRM
app.get('/api/clay/follow-ups', requireAuth, async (req, res) => {
  try {
    const apiKey = getClayApiKey();
    
    if (!apiKey) {
      return res.status(401).json({ error: 'Not connected to Clay CRM' });
    }
    
    const limit = req.query.limit || 10;
    
    try {
      const response = await axios.get(`${CLAY_API_URL}/follow-ups?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      // For demo purposes, if Clay API is not available, return mock data
      if (process.env.NODE_ENV === 'development') {
        const mockFollowUps = generateMockFollowUps(limit);
        return res.json(mockFollowUps);
      }
      
      return res.json(response.data);
    } catch (apiError) {
      console.error('Error fetching Clay follow-ups:', apiError);
      
      if (process.env.NODE_ENV === 'development') {
        const mockFollowUps = generateMockFollowUps(limit);
        return res.json(mockFollowUps);
      }
      
      return res.status(500).json({ error: 'Failed to fetch follow-ups from Clay CRM' });
    }
  } catch (error) {
    console.error('Error in Clay follow-ups endpoint:', error);
    res.status(500).json({ error: 'Failed to process Clay follow-ups request' });
  }
});

// Helper functions to generate mock data for development
function generateMockConnections(limit = 10) {
  const connections = [];
  const companies = ['AWS', 'Google Cloud', 'Microsoft Azure', 'Terraform', 'Kubernetes', 'HashiCorp', 'Docker', 'GitHub', 'GitLab', 'CircleCI', 'Jenkins', 'Ansible', 'Puppet', 'Chef', 'SaltStack'];
  const titles = ['DevOps Engineer', 'Cloud Architect', 'SRE', 'Platform Engineer', 'Infrastructure Engineer', 'Release Engineer', 'Automation Engineer', 'DevSecOps Engineer'];
  
  for (let i = 0; i < limit; i++) {
    connections.push({
      id: `conn-${i}`,
      name: `Test Contact ${i + 1}`,
      company: companies[Math.floor(Math.random() * companies.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
      email: `contact${i + 1}@example.com`,
      dateAdded: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      lastContact: Math.random() > 0.5 ? new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString() : null,
      status: ['New', 'Connected', 'Responded', 'Meeting Scheduled', 'Followed Up'][Math.floor(Math.random() * 5)]
    });
  }
  
  return connections;
}

function generateMockActivities(limit = 10) {
  const activities = [];
  const types = ['connection_request', 'message_sent', 'message_received', 'meeting_scheduled', 'note_added', 'follow_up_set'];
  
  for (let i = 0; i < limit; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    
    activities.push({
      id: `act-${i}`,
      type,
      date: new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString(),
      contact: {
        id: `conn-${Math.floor(Math.random() * 20)}`,
        name: `Test Contact ${Math.floor(Math.random() * 20) + 1}`
      },
      details: getActivityDetails(type)
    });
  }
  
  return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getActivityDetails(type) {
  switch (type) {
    case 'connection_request':
      return { message: 'Connection request sent' };
    case 'message_sent':
      return { message: 'Thanks for connecting! I would love to learn more about your DevOps journey.' };
    case 'message_received':
      return { message: 'Happy to connect! Let me know how I can help with your DevOps career questions.' };
    case 'meeting_scheduled':
      return { 
        title: 'Career Discussion', 
        date: new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString() 
      };
    case 'note_added':
      return { content: 'Interested in AWS and Terraform. Follow up about certification path.' };
    case 'follow_up_set':
      return { 
        date: new Date(Date.now() + Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000).toISOString(),
        reminder: 'Follow up about AWS certification resources'
      };
    default:
      return {};
  }
}

function generateMockFollowUps(limit = 5) {
  const followUps = [];
  
  for (let i = 0; i < limit; i++) {
    followUps.push({
      id: `followup-${i}`,
      contact: {
        id: `conn-${Math.floor(Math.random() * 20)}`,
        name: `Test Contact ${Math.floor(Math.random() * 20) + 1}`
      },
      date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
      reason: ['Check in after meeting', 'Share certification resources', 'Introduce to networking contact', 'Ask about job opening', 'Follow up on technical question'][Math.floor(Math.random() * 5)]
    });
  }
  
  return followUps.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Data management endpoints
// Export dashboard data
app.get('/api/data/export', requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = await exportData();
    res.json(data);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export dashboard data' });
  }
});

// Import dashboard data
app.post('/api/data/import', requireAuth, requireAdmin, async (req, res) => {
  try {
    const importResult = await importData(req.body);
    res.json(importResult);
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ error: error.message || 'Failed to import dashboard data' });
  }
});

// Get available templates
app.get('/api/data/templates', requireAuth, async (req, res) => {
  try {
    const templates = await getTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Error getting templates:', error);
    res.status(500).json({ error: 'Failed to get templates' });
  }
});

// Get specific template
app.get('/api/data/templates/:templateId', requireAuth, async (req, res) => {
  try {
    const { templateId } = req.params;
    const template = await getTemplate(templateId);
    res.json(template);
  } catch (error) {
    console.error(`Error getting template ${req.params.templateId}:`, error);
    res.status(500).json({ error: error.message || 'Failed to get template' });
  }
});

// Get backups
app.get('/api/data/backups', requireAuth, requireAdmin, async (req, res) => {
  try {
    const backups = await getBackups();
    res.json(backups);
  } catch (error) {
    console.error('Error getting backups:', error);
    res.status(500).json({ error: 'Failed to get backups' });
  }
});

// Restore from backup
app.post('/api/data/backups/:backupId/restore', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { backupId } = req.params;
    const restoreResult = await restoreBackup(backupId);
    res.json(restoreResult);
  } catch (error) {
    console.error(`Error restoring backup ${req.params.backupId}:`, error);
    res.status(500).json({ error: error.message || 'Failed to restore backup' });
  }
});

// Create manual backup
app.post('/api/data/backups', requireAuth, requireAdmin, async (req, res) => {
  try {
    const backupPath = await createBackup();
    res.json({ success: true, message: 'Backup created successfully', backupPath });
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

// Cloud sync endpoint
app.post('/api/data/sync', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { provider, options } = req.body;
    
    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' });
    }
    
    // Get current dashboard data
    const data = await exportData();
    
    // Sync data with the selected provider
    const syncResult = await syncData(provider, options, data);
    
    res.json({
      success: true,
      message: `Data synced successfully with ${provider}`,
      ...syncResult
    });
  } catch (error) {
    console.error('Error syncing data:', error);
    res.status(500).json({ error: error.message || 'Failed to sync data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});