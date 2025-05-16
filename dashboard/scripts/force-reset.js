/**
 * Force Reset Dashboard Data
 * 
 * This script forces a complete reset of all dashboard data and clears any browser cache conflicts
 */

const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

// Define paths
const initialDataPath = path.join(__dirname, '..', 'src', 'data', 'initial-data.json');
const dataPath = path.join(__dirname, '..', 'src', 'data', 'data.json');
const backupPath = path.join(__dirname, '..', 'src', 'data', 'backups');
const localStoragePath = path.join(__dirname, '..', 'src', 'data', 'localStorage.json');
const templatesDir = path.join(__dirname, '..', 'src', 'data', 'templates');

// Create readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Ask user to select a template
 * @returns {Promise<string>} Selected template path
 */
const selectTemplate = () => {
  return new Promise((resolve) => {
    console.log('\nSelect a dashboard template for force reset:');
    console.log('1. Accelerated Senior DevOps Path (18-month plan for senior roles)');
    console.log('2. Entry/Mid-Tier DevOps Path (12-month plan for entry-level)');
    console.log('3. Custom Career Path (Build from scratch)');
    console.log('4. Original Initial Data (Basic template)');
    
    rl.question('\nEnter your selection (1-4): ', (answer) => {
      switch (answer.trim()) {
        case '1':
          resolve(path.join(templatesDir, 'accelerated-path.json'));
          break;
        case '2':
          resolve(path.join(templatesDir, 'entry-path.json'));
          break;
        case '3':
          resolve(path.join(templatesDir, 'custom-path.json'));
          break;
        case '4':
          resolve(initialDataPath);
          break;
        default:
          console.log('Invalid selection. Using Original Initial Data as default.');
          resolve(initialDataPath);
      }
    });
  });
};

// Main function
async function forceReset() {
  try {
    console.log("🔄 Starting force reset...");
    
    // Let user select template
    const templatePath = await selectTemplate();
    
    // Ensure backup directory exists
    await fs.ensureDir(backupPath);
    
    // Create backup of current data if it exists
    if (await fs.pathExists(dataPath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFilePath = path.join(backupPath, `data-${timestamp}.json`);
      await fs.copy(dataPath, backupFilePath);
      console.log(`✅ Created backup at ${backupFilePath}`);
    }
    
    // Load selected template
    let templateData;
    try {
      console.log(`📄 Loading template from ${templatePath}...`);
      templateData = await fs.readJson(templatePath);
      
      // Update dates to today
      const today = new Date().toISOString().split('T')[0];
      templateData.overview.lastUpdated = today;
      if (templateData.networking) {
        templateData.networking.lastUpdate = today;
      }
      console.log(`✅ Selected template loaded successfully`);
    } catch (loadError) {
      console.warn(`⚠️ Failed to load selected template: ${loadError.message}`);
      console.log("Falling back to minimal template");
      templateData = createMinimalTemplate();
    }
    
    // Write template data to data.json
    console.log("📝 Writing new data file...");
    await fs.writeJson(dataPath, templateData, { spaces: 2 });
    
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
  rl.close();
  process.exit(0);
}).catch(err => {
  console.error("Unhandled error:", err);
  rl.close();
  process.exit(1);
});