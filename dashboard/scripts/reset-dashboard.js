/**
 * Reset Dashboard Data
 * 
 * This script resets all dashboard data to initial values, allowing users
 * to start tracking from the beginning.
 */

const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

// Load initial data template from file
const initialDataPath = path.join(__dirname, '..', 'src', 'data', 'initial-data.json');
let initialData;

try {
  initialData = fs.readJsonSync(initialDataPath);
  // Update lastUpdated date to today
  initialData.overview.lastUpdated = new Date().toISOString().split('T')[0];
  initialData.networking.lastUpdate = new Date().toISOString().split('T')[0];
} catch (error) {
  console.warn('Could not load initial-data.json, using fallback template');
  // Fallback initial data template if file is missing
  initialData = {
  overview: {
    phase: "Foundation Phase",
    phaseProgress: 0,
    totalGoals: 0,
    completedGoals: 0,
    goalCompletionRate: 0,
    nextMilestone: "Complete Learning Plan",
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  weeklyMetrics: {
    learningHours: 0,
    projectHours: 0,
    networkingHours: 0,
    totalHours: 0,
    targetHours: 35,
    completionRate: 0,
    skillsImproved: 0,
    connectionsAdded: 0
  },
  skills: [
    {
      category: "AWS",
      skills: [],
      averageLevel: 0,
      targetLevel: 80
    },
    {
      category: "Infrastructure as Code",
      skills: [],
      averageLevel: 0,
      targetLevel: 80
    },
    {
      category: "Containers",
      skills: [],
      averageLevel: 0,
      targetLevel: 80
    },
    {
      category: "CI/CD",
      skills: [],
      averageLevel: 0,
      targetLevel: 80
    },
    {
      category: "Monitoring",
      skills: [],
      averageLevel: 0,
      targetLevel: 80
    },
    {
      category: "Scripting",
      skills: [],
      averageLevel: 0,
      targetLevel: 80
    }
  ],
  certifications: [],
  projects: [],
  goals: [],
  learningResources: [],
  networking: {
    totalConnections: 0,
    activeConversations: 0,
    weeklyOutreach: 0,
    followUps: 0,
    lastUpdate: new Date().toISOString().split('T')[0]
  },
  clayMetrics: {
    newConnections: 0,
    connectionAcceptanceRate: 0,
    contentPieces: 0,
    engagementRate: 0,
    followUpsSent: 0,
    responseRate: 0
  }
};}

// Path to data file
const dataPath = path.join(__dirname, '..', 'src', 'data', 'data.json');
const backupPath = path.join(__dirname, '..', 'src', 'data', 'backups');

// Create readline interface for user confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Confirm reset
rl.question('This will reset ALL dashboard data. Are you sure? (yes/no): ', async (answer) => {
  if (answer.toLowerCase() === 'yes') {
    try {
      // Create a backup first
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFilePath = path.join(backupPath, `data-${timestamp}.json`);
      
      // Ensure backup directory exists
      await fs.ensureDir(backupPath);
      
      // Create backup if original file exists
      if (await fs.pathExists(dataPath)) {
        await fs.copy(dataPath, backupFilePath);
        console.log(`✅ Created backup at ${backupFilePath}`);
      }
      
      // Write initial data
      await fs.writeJson(dataPath, initialData, { spaces: 2 });
      console.log('✅ Dashboard data has been reset to initial values');
      
      // Clean localStorage in browser
      console.log('\nIMPORTANT: To complete reset, also clear localStorage in your browser by running:');
      console.log('localStorage.clear() in browser developer console\n');
    } catch (error) {
      console.error('Error resetting dashboard data:', error);
    }
  } else {
    console.log('Reset cancelled');
  }
  
  rl.close();
});