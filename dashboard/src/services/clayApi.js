/**
 * Clay CRM API service
 * Handles communication with the Clay CRM API
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const PROXY_URL = `${API_URL}/clay`;
const API_TIMEOUT = 8000; // 8 second timeout for API calls

// Error class for Clay API errors
class ClayApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ClayApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Fetch connections from Clay CRM
 * @param {number} limit - Maximum number of connections to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of connection objects
 */
export const fetchConnections = async (limit = 50, offset = 0) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(`${PROXY_URL}/connections?limit=${limit}&offset=${offset}`, {
      signal: controller.signal,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new ClayApiError(`Failed to fetch connections: ${response.statusText}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Clay connections:', error);
    throw error;
  }
};

/**
 * Fetch recent activities from Clay CRM
 * @param {number} limit - Maximum number of activities to fetch
 * @returns {Promise<Array>} Array of activity objects
 */
export const fetchActivities = async (limit = 20) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(`${PROXY_URL}/activities?limit=${limit}`, {
      signal: controller.signal,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new ClayApiError(`Failed to fetch activities: ${response.statusText}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Clay activities:', error);
    throw error;
  }
};

/**
 * Fetch networking metrics from Clay CRM
 * @returns {Promise<Object>} Metrics object
 */
export const fetchNetworkingMetrics = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(`${PROXY_URL}/metrics`, {
      signal: controller.signal,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new ClayApiError(`Failed to fetch metrics: ${response.statusText}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Clay metrics:', error);
    throw error;
  }
};

/**
 * Connect to Clay CRM by authenticating with API key
 * @param {string} apiKey - Clay CRM API key
 * @returns {Promise<Object>} Connection status
 */
export const connectToClayApi = async (apiKey) => {
  try {
    const response = await fetch(`${PROXY_URL}/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey }),
    });
    
    if (!response.ok) {
      throw new ClayApiError(`Failed to connect to Clay CRM: ${response.statusText}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error connecting to Clay CRM:', error);
    throw error;
  }
};

/**
 * Check connection status to Clay CRM
 * @returns {Promise<Object>} Connection status object
 */
export const checkClayConnection = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // shorter timeout for status check
    
    const response = await fetch(`${PROXY_URL}/status`, {
      signal: controller.signal,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new ClayApiError(`Failed to check Clay connection: ${response.statusText}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking Clay connection:', error);
    return { connected: false, error: error.message };
  }
};

/**
 * Add a new connection to Clay CRM
 * @param {Object} connectionData - Connection data
 * @returns {Promise<Object>} New connection object
 */
export const addConnection = async (connectionData) => {
  try {
    const response = await fetch(`${PROXY_URL}/connections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(connectionData),
    });
    
    if (!response.ok) {
      throw new ClayApiError(`Failed to add connection: ${response.statusText}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding Clay connection:', error);
    throw error;
  }
};

/**
 * Get upcoming follow-ups from Clay CRM
 * @param {number} limit - Maximum number of follow-ups to fetch
 * @returns {Promise<Array>} Array of follow-up objects
 */
export const getUpcomingFollowUps = async (limit = 10) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(`${PROXY_URL}/follow-ups?limit=${limit}`, {
      signal: controller.signal,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new ClayApiError(`Failed to fetch follow-ups: ${response.statusText}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching follow-ups:', error);
    throw error;
  }
};