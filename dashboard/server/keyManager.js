/**
 * Key Manager Service
 * Securely manages API keys and sensitive credentials
 */
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Encryption settings
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET; // Fallback to JWT_SECRET
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For AES, this is always 16
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const ENCODING = 'hex';

// Config file path for fallback storage
const CONFIG_DIR = path.join(__dirname, '..', 'src', 'data');
const ENCRYPTED_CONFIG_PATH = path.join(CONFIG_DIR, 'secure-config.enc');

// Ensure config directory exists
fs.ensureDirSync(CONFIG_DIR);

/**
 * Encrypt a value
 * @param {string} text - Text to encrypt
 * @returns {string} - Encrypted text
 */
const encrypt = (text) => {
  if (!text) return '';
  if (!ENCRYPTION_KEY) {
    console.warn('Warning: No encryption key found, storing in plaintext');
    return text;
  }

  try {
    // Random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    // Random salt
    const salt = crypto.randomBytes(SALT_LENGTH);
    
    // Key derivation
    const key = crypto.scryptSync(ENCRYPTION_KEY, salt, 32);
    
    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', ENCODING);
    encrypted += cipher.final(ENCODING);
    
    // Get auth tag
    const tag = cipher.getAuthTag();
    
    // Format: iv:salt:tag:encryptedData
    return `${iv.toString(ENCODING)}:${salt.toString(ENCODING)}:${tag.toString(ENCODING)}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

/**
 * Decrypt a value
 * @param {string} encryptedText - Text to decrypt
 * @returns {string} - Decrypted text
 */
const decrypt = (encryptedText) => {
  if (!encryptedText) return '';
  if (!ENCRYPTION_KEY) {
    console.warn('Warning: No encryption key found, assuming plaintext');
    return encryptedText;
  }
  
  try {
    // Split parts
    const parts = encryptedText.split(':');
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted text format');
    }
    
    const iv = Buffer.from(parts[0], ENCODING);
    const salt = Buffer.from(parts[1], ENCODING);
    const tag = Buffer.from(parts[2], ENCODING);
    const encryptedData = parts[3];
    
    // Key derivation
    const key = crypto.scryptSync(ENCRYPTION_KEY, salt, 32);
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    // Decrypt
    let decrypted = decipher.update(encryptedData, ENCODING, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};

/**
 * Read the encrypted config file
 * @returns {Object} - Config object
 */
const readEncryptedConfig = () => {
  try {
    if (!fs.existsSync(ENCRYPTED_CONFIG_PATH)) {
      return {};
    }
    
    const encryptedData = fs.readFileSync(ENCRYPTED_CONFIG_PATH, 'utf8');
    if (!encryptedData) return {};
    
    const decrypted = decrypt(encryptedData);
    if (!decrypted) return {};
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error reading encrypted config:', error);
    return {};
  }
};

/**
 * Write to the encrypted config file
 * @param {Object} config - Config object to write
 */
const writeEncryptedConfig = (config) => {
  try {
    const data = JSON.stringify(config);
    const encrypted = encrypt(data);
    
    fs.writeFileSync(ENCRYPTED_CONFIG_PATH, encrypted);
  } catch (error) {
    console.error('Error writing encrypted config:', error);
  }
};

/**
 * Get a key from environment or encrypted storage
 * @param {string} key - Key name (matches environment variable name)
 * @param {string} storageKey - Key name in encrypted storage (defaults to key)
 * @returns {string} - Key value
 */
const getKey = (key, storageKey = key) => {
  // First try to get from environment variable
  if (process.env[key]) {
    return process.env[key];
  }
  
  // Fall back to encrypted storage
  const config = readEncryptedConfig();
  return config[storageKey] || '';
};

/**
 * Set a key in encrypted storage
 * @param {string} key - Key name
 * @param {string} value - Key value
 */
const setKey = (key, value) => {
  const config = readEncryptedConfig();
  config[key] = value;
  writeEncryptedConfig(config);
};

/**
 * Get the Clay API key
 * @returns {string} - Clay API key
 */
const getClayApiKey = () => {
  return getKey('CLAY_API_KEY', 'clayApiKey');
};

/**
 * Set the Clay API key
 * @param {string} apiKey - Clay API key
 */
const setClayApiKey = (apiKey) => {
  setKey('clayApiKey', apiKey);
};

/**
 * Get Clay connection status
 * @returns {Object} - Connection status
 */
const getClayConnectionStatus = () => {
  const config = readEncryptedConfig();
  return {
    connected: !!config.clayApiConnected,
    lastConnected: config.clayLastConnected || null
  };
};

/**
 * Set Clay connection status
 * @param {boolean} connected - Connection status
 */
const setClayConnectionStatus = (connected, timestamp = null) => {
  const config = readEncryptedConfig();
  config.clayApiConnected = connected;
  
  if (timestamp) {
    config.clayLastConnected = timestamp;
  } else if (connected) {
    config.clayLastConnected = new Date().toISOString();
  }
  
  writeEncryptedConfig(config);
};

/**
 * Migrate from old clay-config.json to encrypted storage
 * @param {string} oldConfigPath - Path to old config file
 */
const migrateFromLegacyConfig = (oldConfigPath) => {
  try {
    if (fs.existsSync(oldConfigPath)) {
      console.log('Migrating from legacy clay-config.json to encrypted storage...');
      
      const oldConfig = fs.readJsonSync(oldConfigPath);
      
      if (oldConfig.apiKey) {
        setClayApiKey(oldConfig.apiKey);
        setClayConnectionStatus(oldConfig.connected, oldConfig.lastConnected);
        
        // Backup old config and remove it
        const backupPath = `${oldConfigPath}.bak`;
        fs.copySync(oldConfigPath, backupPath);
        fs.writeJsonSync(oldConfigPath, {
          apiKey: '',
          connected: false,
          lastConnected: null,
          migrated: true,
          migratedAt: new Date().toISOString()
        });
        
        console.log('Migration completed successfully');
      }
    }
  } catch (error) {
    console.error('Error migrating from legacy config:', error);
  }
};

module.exports = {
  getClayApiKey,
  setClayApiKey,
  getClayConnectionStatus,
  setClayConnectionStatus,
  migrateFromLegacyConfig,
  encrypt,
  decrypt
};