#!/usr/bin/env node

/**
 * Setup script for creating an admin user and setting up the dashboard template
 * Generates a password hash, updates the .env file, and initializes data
 */

const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('template', {
    alias: 't',
    description: 'Dashboard template to use',
    type: 'string',
    choices: ['accelerated-path', 'entry-path', 'custom-path'],
  })
  .help()
  .alias('help', 'h')
  .argv;

// Path to .env file
const ENV_FILE_PATH = path.join(__dirname, '..', '.env');
const DATA_PATH = path.join(__dirname, '../src/data/data.json');
const TEMPLATES_DIR = path.join(__dirname, '../src/data/templates');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Ask user for input
 * @param {string} question - Question to ask
 * @returns {Promise<string>} User input
 */
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

/**
 * Generate a secure random JWT secret
 * @returns {string} Random JWT secret
 */
const generateJwtSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Initialize dashboard with selected template
 * @param {string} templateName - Name of the template to use
 */
const initializeWithTemplate = async (templateName) => {
  const templatePath = path.join(TEMPLATES_DIR, `${templateName}.json`);
  
  try {
    // Read template data
    const templateData = await fs.readFile(templatePath, 'utf8');
    
    // Write to data.json
    await fs.writeFile(DATA_PATH, templateData);
    
    console.log(`\nDashboard initialized with the ${templateName} template!`);
  } catch (error) {
    console.error(`Error initializing with template ${templateName}:`, error);
    console.log('Falling back to default template...');
    
    // Fallback to initial-data.json
    const initialDataPath = path.join(__dirname, '../src/data/initial-data.json');
    const initialData = await fs.readFile(initialDataPath, 'utf8');
    await fs.writeFile(DATA_PATH, initialData);
  }
};

/**
 * Display template options and get user selection
 * @returns {Promise<string>} Selected template name
 */
const selectTemplate = async () => {
  console.log('\nSelect a dashboard template:');
  console.log('1. Accelerated Senior DevOps Path (18-month plan for senior roles)');
  console.log('2. Entry/Mid-Tier DevOps Path (12-month plan for entry-level)');
  console.log('3. Custom Career Path (Build from scratch)');
  
  const selection = await askQuestion('\nEnter your selection (1-3): ');
  
  switch (selection.trim()) {
    case '1':
      return 'accelerated-path';
    case '2':
      return 'entry-path';
    case '3':
      return 'custom-path';
    default:
      console.log('Invalid selection. Using Custom Path as default.');
      return 'custom-path';
  }
};

/**
 * Main function
 */
const main = async () => {
  try {
    console.log('DevOps Dashboard Admin Setup\n');
    
    // Ask for admin username
    const username = await askQuestion('Enter admin username (default: admin): ');
    const adminUsername = username.trim() || 'admin';
    
    // Ask for admin password
    const password = await askQuestion('Enter admin password: ');
    
    if (!password) {
      console.error('Error: Password cannot be empty');
      process.exit(1);
    }
    
    // Generate password hash
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Generate JWT secret
    const jwtSecret = generateJwtSecret();
    
    // Create or update .env file
    let envContent;
    try {
      envContent = await fs.readFile(ENV_FILE_PATH, 'utf8');
    } catch (err) {
      // File doesn't exist, create a new one
      envContent = '';
    }
    
    // Update environment variables
    const envVars = {
      ADMIN_USERNAME: adminUsername,
      ADMIN_PASSWORD_HASH: passwordHash,
      JWT_SECRET: jwtSecret
    };
    
    // Update .env file content
    for (const [key, value] of Object.entries(envVars)) {
      // Check if variable already exists in .env file
      const regex = new RegExp(`^${key}=.*`, 'm');
      if (regex.test(envContent)) {
        // Replace existing variable
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        // Add new variable
        envContent += `\n${key}=${value}`;
      }
    }
    
    // Write updated .env file
    await fs.writeFile(ENV_FILE_PATH, envContent);
    
    console.log('\nAdmin setup completed successfully!');
    console.log(`Username: ${adminUsername}`);
    console.log('Password: [hidden]');
    console.log('\nA secure JWT secret has been generated and saved to .env');
    
    // Initialize dashboard with template
    let templateName = argv.template;
    
    if (!templateName) {
      templateName = await selectTemplate();
    }
    
    await initializeWithTemplate(templateName);
    
    console.log('\nDashboard setup complete! You can now run the dashboard with:');
    console.log('./start-personal.sh');
    
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
};

// Run the script
main();