#!/usr/bin/env node

/**
 * Generate an encryption key for securing sensitive data
 * This key will be used to encrypt/decrypt API keys and other sensitive information
 */

const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

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
 * Generate a secure random encryption key
 * @returns {string} Random encryption key
 */
const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Main function
 */
const main = async () => {
  try {
    console.log('DevOps Dashboard Encryption Key Generator\n');
    console.log('This script will generate a secure key for encrypting sensitive data.');
    console.log('The key will be added to your .env file as ENCRYPTION_KEY.\n');
    
    // Ask for confirmation
    const confirm = await askQuestion('Do you want to generate a new encryption key? (y/n): ');
    
    if (confirm.toLowerCase() !== 'y') {
      console.log('Operation cancelled.');
      process.exit(0);
    }
    
    // Generate encryption key
    const encryptionKey = generateEncryptionKey();
    
    // Create or update .env file
    let envContent;
    try {
      envContent = await fs.readFile(ENV_FILE_PATH, 'utf8');
    } catch (err) {
      // File doesn't exist, create a new one
      envContent = '';
    }
    
    // Check if ENCRYPTION_KEY already exists
    const regex = new RegExp('^ENCRYPTION_KEY=.*', 'm');
    if (regex.test(envContent)) {
      // Warn user about replacing existing key
      console.log('\nWARNING: An encryption key already exists in your .env file.');
      console.log('Replacing it will make previously encrypted data unreadable.');
      
      const replaceConfirm = await askQuestion('Are you sure you want to replace it? (y/n): ');
      
      if (replaceConfirm.toLowerCase() !== 'y') {
        console.log('Operation cancelled.');
        process.exit(0);
      }
      
      // Replace existing key
      envContent = envContent.replace(regex, `ENCRYPTION_KEY=${encryptionKey}`);
    } else {
      // Add new key
      envContent += `\nENCRYPTION_KEY=${encryptionKey}`;
    }
    
    // Write updated .env file
    await fs.writeFile(ENV_FILE_PATH, envContent);
    
    console.log('\nEncryption key generated and added to .env file.');
    console.log('IMPORTANT: Keep this key secure. If lost, encrypted data cannot be recovered.');
    
  } catch (error) {
    console.error('Error generating encryption key:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
};

// Run the script
main();