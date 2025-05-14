/**
 * API service for dashboard data
 * Uses authFetch to secure API requests
 */

import { authFetch } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Fetch dashboard data
 * @returns {Promise<Object>} Dashboard data
 */
export const fetchDashboardData = async () => {
  try {
    const response = await authFetch(`${API_URL}/data`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

/**
 * Update dashboard data
 * @param {Object} data - New dashboard data
 * @returns {Promise<Object>} Result of update
 */
export const updateDashboardData = async (data) => {
  try {
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
    throw error;
  }
};

/**
 * Update task completion status
 * @param {string} taskId - Task ID
 * @param {boolean} completed - Completion status
 * @returns {Promise<Object>} Result of update
 */
export const updateTaskStatus = async (taskId, completed) => {
  try {
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
    throw error;
  }
};

/**
 * Run dashboard update script
 * @returns {Promise<Object>} Result of update
 */
export const runDashboardUpdate = async () => {
  try {
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
    throw error;
  }
};