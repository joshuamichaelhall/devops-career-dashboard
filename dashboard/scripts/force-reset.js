/**
 * Force Reset Dashboard Data
 * 
 * This script forces a complete reset of all dashboard data and clears any browser cache conflicts
 */

const fs = require('fs-extra');
const path = require('path');

// Define paths
const initialDataPath = path.join(__dirname, '..', 'src', 'data', 'initial-data.json');
const dataPath = path.join(__dirname, '..', 'src', 'data', 'data.json');
const backupPath = path.join(__dirname, '..', 'src', 'data', 'backups');
const localStoragePath = path.join(__dirname, '..', 'src', 'data', 'localStorage.json');

// Main function
async function forceReset() {
  try {
    console.log("🔄 Starting force reset...");
    
    // Ensure backup directory exists
    await fs.ensureDir(backupPath);
    
    // Create backup of current data if it exists
    if (await fs.pathExists(dataPath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFilePath = path.join(backupPath, `data-${timestamp}.json`);
      await fs.copy(dataPath, backupFilePath);
      console.log(`✅ Created backup at ${backupFilePath}`);
    }
    
    // Check if initial data template exists
    let initialData;
    if (await fs.pathExists(initialDataPath)) {
      console.log("📄 Loading initial data template...");
      initialData = await fs.readJson(initialDataPath);
      
      // Update dates to today
      const today = new Date().toISOString().split('T')[0];
      initialData.overview.lastUpdated = today;
      if (initialData.networking) {
        initialData.networking.lastUpdate = today;
      }
    } else {
      console.warn("⚠️ Initial data template not found, using minimal template");
      initialData = createMinimalTemplate();
    }
    
    // Write initial data to data.json
    console.log("📝 Writing new data file...");
    await fs.writeJson(dataPath, initialData, { spaces: 2 });
    
    // Create localStorage clear helper
    console.log("🔑 Creating localStorage reset helper...");
    const localStorageReset = {
      dashboard_auth_token: null,
      dashboard_user: null,
      theme: null,
      dashboard_data: null,
      dashboard_backups: []
    };
    await fs.writeJson(localStoragePath, localStorageReset, { spaces: 2 });
    
    console.log("\n✅ Dashboard has been completely reset!");
    console.log("\n🌟 IMPORTANT NEXT STEPS:");
    console.log("1. Restart the dashboard server");
    console.log("2. Clear your browser cache for the dashboard site");
    console.log("3. Reload the page");
    console.log("\n🔍 If problems persist, try:");
    console.log("- Using incognito/private mode");
    console.log("- Manually clearing localStorage in browser devtools");
    console.log("- Use './start-personal.sh' script to restart with clean data");
    
  } catch (error) {
    console.error("❌ Error during force reset:", error);
    process.exit(1);
  }
}

// Create minimal template if initial-data.json is missing
function createMinimalTemplate() {
  return {
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
    }
  };
}

// Run the reset function
forceReset().then(() => {
  process.exit(0);
}).catch(err => {
  console.error("Unhandled error:", err);
  process.exit(1);
});