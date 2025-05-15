/**
 * Data Manager Utility
 * Provides functions for data import/export and backup management
 */

const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

// Data file paths
const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'data.json');
const DATA_BACKUP_DIR = path.join(__dirname, '..', 'src', 'data', 'backups');
const TEMPLATES_DIR = path.join(__dirname, '..', 'src', 'data', 'templates');

// Ensure backup directory exists
fs.ensureDirSync(DATA_BACKUP_DIR);

/**
 * Create a backup of the current data
 * @returns {Promise<string>} Path to the backup file
 */
const createBackup = async () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(DATA_BACKUP_DIR, `data-${timestamp}.json`);
    
    // Check if main data file exists
    if (await fs.pathExists(DATA_PATH)) {
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
      
      return backupPath;
    }
    
    return null;
  } catch (error) {
    console.error('Error creating backup:', error);
    throw new Error('Failed to create backup');
  }
};

/**
 * Import data from a file
 * @param {Object} data - The data to import
 * @returns {Promise<Object>} Result of the import
 */
const importData = async (data) => {
  try {
    // Create a backup first
    const backupPath = await createBackup();
    
    // Validate the data structure
    validateData(data);
    
    // Write the new data
    await fs.writeJson(DATA_PATH, data, { spaces: 2 });
    
    return { 
      success: true, 
      message: 'Data imported successfully',
      backupPath: backupPath 
    };
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error(`Failed to import data: ${error.message}`);
  }
};

/**
 * Export current dashboard data
 * @returns {Promise<Object>} The exported data
 */
const exportData = async () => {
  try {
    // Check if the data file exists
    if (await fs.pathExists(DATA_PATH)) {
      return await fs.readJson(DATA_PATH);
    }
    
    throw new Error('No data file found');
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
};

/**
 * Get a list of available templates
 * @returns {Promise<Array>} List of template names
 */
const getTemplates = async () => {
  try {
    const files = await fs.readdir(TEMPLATES_DIR);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => ({
        id: path.basename(file, '.json'),
        name: formatTemplateName(path.basename(file, '.json'))
      }));
  } catch (error) {
    console.error('Error getting templates:', error);
    return [];
  }
};

/**
 * Get a specific template
 * @param {string} templateId - The template ID
 * @returns {Promise<Object>} The template data
 */
const getTemplate = async (templateId) => {
  try {
    const templatePath = path.join(TEMPLATES_DIR, `${templateId}.json`);
    
    if (await fs.pathExists(templatePath)) {
      return await fs.readJson(templatePath);
    }
    
    throw new Error('Template not found');
  } catch (error) {
    console.error(`Error getting template ${templateId}:`, error);
    throw new Error(`Failed to get template: ${error.message}`);
  }
};

/**
 * Get a list of available backups
 * @returns {Promise<Array>} List of backup files
 */
const getBackups = async () => {
  try {
    const files = await fs.readdir(DATA_BACKUP_DIR);
    
    return files
      .filter(file => file.startsWith('data-') && file.endsWith('.json'))
      .map(file => {
        // Extract timestamp from filename
        const timestamp = file.replace('data-', '').replace('.json', '').replace(/-/g, ':');
        return {
          id: path.basename(file, '.json'),
          date: new Date(timestamp).toISOString(),
          path: path.join(DATA_BACKUP_DIR, file)
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error getting backups:', error);
    return [];
  }
};

/**
 * Restore from a backup
 * @param {string} backupId - The backup ID
 * @returns {Promise<Object>} Result of the restore
 */
const restoreBackup = async (backupId) => {
  try {
    const backupPath = path.join(DATA_BACKUP_DIR, `${backupId}.json`);
    
    if (await fs.pathExists(backupPath)) {
      // Create a backup of the current data first
      await createBackup();
      
      // Copy the backup to the main data file
      await fs.copy(backupPath, DATA_PATH);
      
      return { success: true, message: 'Backup restored successfully' };
    }
    
    throw new Error('Backup not found');
  } catch (error) {
    console.error(`Error restoring backup ${backupId}:`, error);
    throw new Error(`Failed to restore backup: ${error.message}`);
  }
};

/**
 * Validate data structure
 * @param {Object} data - The data to validate
 * @returns {boolean} True if valid
 */
const validateData = (data) => {
  // Check for required top-level sections
  const requiredSections = ['overview', 'weeklyMetrics', 'skills', 'goals'];
  
  for (const section of requiredSections) {
    if (!data[section]) {
      throw new Error(`Missing required section: ${section}`);
    }
  }
  
  // Additional validation can be added here
  
  return true;
};

/**
 * Format template name for display
 * @param {string} templateId - The template ID
 * @returns {string} Formatted name
 */
const formatTemplateName = (templateId) => {
  switch (templateId) {
    case 'early-career':
      return 'Early Career (0-2 years)';
    case 'mid-career':
      return 'Mid-Career (2-5 years)';
    case 'senior-career':
      return 'Senior Career (5+ years)';
    default:
      return templateId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }
};

/**
 * Generate a unique ID for data items
 * @returns {string} Unique ID
 */
const generateId = () => {
  return crypto.randomBytes(8).toString('hex');
};

module.exports = {
  createBackup,
  importData,
  exportData,
  getTemplates,
  getTemplate,
  getBackups,
  restoreBackup,
  generateId
};