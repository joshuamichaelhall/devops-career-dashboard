/**
 * Authentication service for the dashboard
 * Provides functions for login, logout, and checking authentication status
 */

// DEMO MODE FLAG
const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true';
// Determine API URL based on hostname
let apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
if (window.location.hostname === 'devops-dashboard.joshuamichaelhall.com') {
  apiBaseUrl = 'https://devops-dashboard.joshuamichaelhall.com';
}
const API_URL = `${apiBaseUrl}/api`;
const TOKEN_KEY = 'dashboard_auth_token';
const USER_KEY = 'dashboard_user';

/**
 * Log in with username and password
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object>} Authentication result
 */
export const login = async (username, password) => {
  try {
    if (DEMO_MODE) {
      console.log('Demo mode: simulating login with', username);
      
      // In demo mode, any credentials work
      const demoUser = {
        id: 'demo-user',
        username: 'demo',
        isAdmin: false
      };
      
      // Still simulate a delay to mimic network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Store auth token and user info in localStorage
      localStorage.setItem(TOKEN_KEY, 'demo-token-xyz123');
      localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
      
      return { success: true, user: demoUser };
    }
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Authentication failed');
    }

    const data = await response.json();
    
    // Store auth token and user info in localStorage
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify({ 
      username: data.username,
      isAdmin: data.isAdmin 
    }));
    
    return { success: true, user: data };
  } catch (error) {
    console.error('Login error:', error);
    
    if (DEMO_MODE) {
      // Always succeed in demo mode
      const demoUser = {
        id: 'demo-user',
        username: 'demo',
        isAdmin: false
      };
      
      localStorage.setItem(TOKEN_KEY, 'demo-token-xyz123');
      localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
      
      return { success: true, user: demoUser };
    }
    
    return { success: false, error: error.message };
  }
};

/**
 * Log out current user
 */
export const logout = () => {
  if (DEMO_MODE) {
    console.log('Demo mode: simulating logout');
    // Redirect without actually clearing storage in demo mode
    window.location.href = '/login';
    return { success: true };
  }
  
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  
  // Redirect to login page
  window.location.href = '/login';
  return { success: true };
};

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export const isAuthenticated = () => {
  if (DEMO_MODE) {
    return true; // Always authenticated in demo mode
  }
  
  return !!getAuthToken();
};

/**
 * Get current user information
 * @returns {Object|null} User object or null if not authenticated
 */
export const getCurrentUser = () => {
  if (DEMO_MODE) {
    // Always return demo user in demo mode
    return {
      id: 'demo-user',
      username: 'demo',
      isAdmin: false
    };
  }
  
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Check if current user is admin
 * @returns {boolean} True if user is admin
 */
export const isAdmin = () => {
  if (DEMO_MODE) {
    return false; // Demo user is not admin
  }
  
  const user = getCurrentUser();
  return user && user.isAdmin;
};

/**
 * Get auth token for API requests
 * @returns {string|null} Auth token or null if not authenticated
 */
export const getAuthToken = () => {
  if (DEMO_MODE) {
    return 'demo-token-xyz123'; // Demo token
  }
  
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Add auth token to fetch headers
 * @param {Object} headers - Headers object to add token to
 * @returns {Object} Headers with auth token added
 */
export const addAuthHeader = (headers = {}) => {
  const token = getAuthToken();
  
  if (token) {
    return {
      ...headers,
      'Authorization': `Bearer ${token}`
    };
  }
  
  return headers;
};

/**
 * Create a protected fetch function that adds auth headers
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise} Fetch result
 */
export const authFetch = async (url, options = {}) => {
  const headers = addAuthHeader(options.headers || {});
  
  // Special case for demo mode - prevent actual API calls for modifying data
  if (DEMO_MODE && 
      (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH' || options.method === 'DELETE')) {
    console.log('Demo mode: API call would be:', options.method, url);
    
    // For dashboard data fetch, return demo data
    if (url.includes('/dashboard/data')) {
      return {
        ok: true,
        json: async () => require('../data/demo-data.json')
      };
    }
    
    // For other endpoints, simulate success
    return {
      ok: true,
      json: async () => ({ 
        success: true, 
        message: 'This is a read-only demo. Data modifications are not saved.' 
      })
    };
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  // If unauthorized in non-demo mode, log out
  if (response.status === 401 && !DEMO_MODE) {
    logout();
    throw new Error('Your session has expired. Please log in again.');
  }
  
  return response;
};