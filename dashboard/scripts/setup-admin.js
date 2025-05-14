#!/usr/bin/env node

/**
 * Setup script for creating an admin user
 * Generates a password hash and updates the .env file
 */

const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

// Path to .env file
const ENV_FILE_PATH = path.join(__dirname, '..', '.env');

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
    console.log('You can now run the dashboard with full authentication.');
    
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
};

// Run the script
main();