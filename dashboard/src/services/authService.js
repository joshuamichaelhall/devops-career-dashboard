/**
 * Authentication service for the dashboard
 * Provides functions for login, logout, and checking authentication status
 */

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
    const response = await fetch('/api/auth/login', {
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
    return { success: false, error: error.message };
  }
};

/**
 * Log out current user
 */
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  
  // Redirect to login page
  window.location.href = '/login';
};

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

/**
 * Get current user information
 * @returns {Object|null} User object or null if not authenticated
 */
export const getCurrentUser = () => {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Check if current user is admin
 * @returns {boolean} True if user is admin
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.isAdmin;
};

/**
 * Get auth token for API requests
 * @returns {string|null} Auth token or null if not authenticated
 */
export const getAuthToken = () => {
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
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  // If unauthorized, log out
  if (response.status === 401) {
    logout();
    throw new Error('Your session has expired. Please log in again.');
  }
  
  return response;
};