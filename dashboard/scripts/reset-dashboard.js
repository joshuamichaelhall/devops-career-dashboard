/**
 * Reset Dashboard Data
 * 
 * This script resets all dashboard data, allowing users to select from multiple templates
 * and start tracking from the beginning.
 */

const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('template', {
    alias: 't',
    description: 'Dashboard template to use',
    type: 'string',
    choices: ['accelerated-path', 'entry-path', 'custom-path', 'initial'],
  })
  .help()
  .alias('help', 'h')
  .argv;

// Paths
const initialDataPath = path.join(__dirname, '..', 'src', 'data', 'initial-data.json');
const dataPath = path.join(__dirname, '..', 'src', 'data', 'data.json');
const backupPath = path.join(__dirname, '..', 'src', 'data', 'backups');
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
    console.log('\nSelect a dashboard template:');
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
          console.log('Invalid selection. Using Custom Path as default.');
          resolve(path.join(templatesDir, 'custom-path.json'));
      }
    });
  });
};

/**
 * Load template data by name
 * @param {string} templateName - Name of the template
 * @returns {Promise<Object>} Template data
 */
const loadTemplateData = async (templateName) => {
  let templatePath;
  
  if (templateName === 'initial') {
    templatePath = initialDataPath;
  } else {
    templatePath = path.join(templatesDir, `${templateName}.json`);
  }
  
  try {
    const templateData = await fs.readJson(templatePath);
    
    // Update dates to today
    templateData.overview.lastUpdated = new Date().toISOString().split('T')[0];
    templateData.networking.lastUpdate = new Date().toISOString().split('T')[0];
    
    return templateData;
  } catch (error) {
    console.warn(`Could not load template ${templateName}, using fallback template`);
    
    // Fallback initial data template if file is missing
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
    };
  }
};

/**
 * Perform the data reset
 */
const resetDashboard = async () => {
  try {
    // Determine which template to use
    let templateData;
    
    if (argv.template) {
      templateData = await loadTemplateData(argv.template);
      console.log(`Using the ${argv.template} template`);
    } else {
      const templatePath = await selectTemplate();
      templateData = await fs.readJson(templatePath);
      
      // Update dates to today
      templateData.overview.lastUpdated = new Date().toISOString().split('T')[0];
      templateData.networking.lastUpdate = new Date().toISOString().split('T')[0];
      
      console.log(`Selected template loaded successfully`);
    }
    
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
    
    // Write template data to data.json
    await fs.writeJson(dataPath, templateData, { spaces: 2 });
    console.log('✅ Dashboard data has been reset with the selected template');
    
    // Clean localStorage in browser
    console.log('\nIMPORTANT: To complete reset, also clear localStorage in your browser by running:');
    console.log('localStorage.clear() in browser developer console\n');
    
  } catch (error) {
    console.error('Error resetting dashboard data:', error);
  }
};

// Confirm reset
rl.question('This will reset ALL dashboard data. Are you sure? (yes/no): ', async (answer) => {
  if (answer.toLowerCase() === 'yes') {
    await resetDashboard();
  } else {
    console.log('Reset cancelled');
  }
  
  rl.close();
});