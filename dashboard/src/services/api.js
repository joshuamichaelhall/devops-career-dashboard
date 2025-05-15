/**
 * API service for dashboard data
 * Uses authFetch to secure API requests
 */

import { authFetch } from './authService';

// Determine API URL based on hostname
let apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
if (window.location.hostname === 'devops-dashboard.joshuamichaelhall.com') {
  apiBaseUrl = 'https://devops-dashboard.joshuamichaelhall.com';
}
const API_URL = `${apiBaseUrl}/api`;

// DEMO MODE FLAG
const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true';

/**
 * Fetch dashboard data
 * @returns {Promise<Object>} Dashboard data
 */
export const fetchDashboardData = async () => {
  try {
    const response = await authFetch(`${API_URL}/dashboard/data`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    // Attempt to load data from appropriate source
    try {
      // In demo mode, use demo data
      if (DEMO_MODE) {
        console.log('Loading demo data as fallback...');
        return require('../data/demo-data.json');
      }
      
      // In personal mode, try to load directly from data.json
      console.log('Loading local data file as fallback...');
      return require('../data/data.json');
    } catch (fallbackError) {
      console.error('Failed to load fallback data:', fallbackError);
      throw error; // Throw the original error
    }
  }
};

/**
 * Update dashboard data
 * @param {Object} data - New dashboard data
 * @returns {Promise<Object>} Result of update
 */
export const updateDashboardData = async (data) => {
  try {
    if (DEMO_MODE) {
      console.log('DEMO MODE: Simulating dashboard update');
      return { success: true, message: 'This is a read-only demo. Data modifications are not saved.' };
    }
    
    const response = await authFetch(`${API_URL}/data`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update dashboard data: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating dashboard data:', error);
    if (DEMO_MODE) {
      return { success: true, message: 'This is a read-only demo. Data modifications are not saved.' };
    }
    throw error;
  }
};

/**
 * Update a specific section of dashboard data
 * @param {string} section - Section name
 * @param {Object} data - New section data
 * @returns {Promise<Object>} Result of update
 */
export const updateSection = async (section, data) => {
  try {
    if (DEMO_MODE) {
      console.log(`DEMO MODE: Simulating update to ${section} section`);
      return { success: true, message: 'This is a read-only demo. Data modifications are not saved.' };
    }
    
    const response = await authFetch(`${API_URL}/data/${section}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update ${section}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating ${section}:`, error);
    if (DEMO_MODE) {
      return { success: true, message: 'This is a read-only demo. Data modifications are not saved.' };
    }
    throw error;
  }
};

/**
 * Update a specific dashboard section
 * Added for compatibility with DashboardContext
 */
export const updateDashboardSection = async (section, data) => {
  return updateSection(section, data);
};

/**
 * Update task completion status
 * @param {string} taskId - Task ID
 * @param {boolean} completed - Completion status
 * @returns {Promise<Object>} Result of update
 */
export const updateTaskStatus = async (taskId, completed) => {
  try {
    if (DEMO_MODE) {
      console.log(`DEMO MODE: Simulating task update for ${taskId}`);
      return { success: true, message: 'This is a read-only demo. Data modifications are not saved.' };
    }
    
    const response = await authFetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update task: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    if (DEMO_MODE) {
      return { success: true, message: 'This is a read-only demo. Data modifications are not saved.' };
    }
    throw error;
  }
};

/**
 * Log time for a category
 * @param {string} category - Time category
 * @param {number} hours - Hours spent
 * @param {string} date - Date of time entry
 * @returns {Promise<Object>} Result of time log
 */
export const logTime = async (category, hours, date) => {
  try {
    if (DEMO_MODE) {
      console.log(`DEMO MODE: Simulating time log for ${category}`);
      return { success: true, message: 'This is a read-only demo. Data modifications are not saved.' };
    }
    
    const response = await authFetch(`${API_URL}/time-log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category, hours, date }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to log time: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error logging time:', error);
    if (DEMO_MODE) {
      return { success: true, message: 'This is a read-only demo. Data modifications are not saved.' };
    }
    throw error;
  }
};

/**
 * Add a new learning resource
 * @param {Object} resourceData - Resource data
 * @returns {Promise<Object>} Result of adding resource
 */
export const addLearningResource = async (resourceData) => {
  try {
    if (DEMO_MODE) {
      console.log(`DEMO MODE: Simulating adding resource ${resourceData.title}`);
      return { 
        success: true, 
        message: 'This is a read-only demo. Data modifications are not saved.',
        resource: {
          id: `demo-${Date.now()}`,
          ...resourceData,
          dateAdded: new Date().toISOString().split('T')[0]
        }
      };
    }
    
    const response = await authFetch(`${API_URL}/learning-resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resourceData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add learning resource: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding learning resource:', error);
    if (DEMO_MODE) {
      return { 
        success: true, 
        message: 'This is a read-only demo. Data modifications are not saved.',
        resource: {
          id: `demo-${Date.now()}`,
          ...resourceData,
          dateAdded: new Date().toISOString().split('T')[0]
        }
      };
    }
    throw error;
  }
};

/**
 * Update learning resource
 * @param {string} id - Resource ID
 * @param {Object} updates - Resource updates
 * @returns {Promise<Object>} Result of update
 */
export const updateLearningResource = async (id, updates) => {
  try {
    if (DEMO_MODE) {
      console.log(`DEMO MODE: Simulating resource update for ${id}`);
      return { success: true, message: 'This is a read-only demo. Data modifications are not saved.' };
    }
    
    const response = await authFetch(`${API_URL}/learning-resources/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update learning resource: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating learning resource:', error);
    if (DEMO_MODE) {
      return { success: true, message: 'This is a read-only demo. Data modifications are not saved.' };
    }
    throw error;
  }
};

/**
 * Run dashboard update script
 * @returns {Promise<Object>} Result of update
 */
export const runDashboardUpdate = async () => {
  try {
    if (DEMO_MODE) {
      console.log('DEMO MODE: Simulating dashboard update script');
      return { success: true, message: 'This is a read-only demo. Data modifications are not saved.' };
    }
    
    const response = await authFetch(`${API_URL}/update-dashboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to run dashboard update: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error running dashboard update:', error);
    if (DEMO_MODE) {
      return { success: true, message: 'This is a read-only demo. Data modifications are not saved.' };
    }
    throw error;
  }
};