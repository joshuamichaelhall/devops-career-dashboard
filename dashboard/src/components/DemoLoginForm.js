import React, { useState, useEffect } from 'react';
import { login } from '../services/authService';

/**
 * Login form component for demo dashboard with pre-filled demo credentials
 */
const DemoLoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demopassword');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoAutoLogin, setDemoAutoLogin] = useState(false);

  // Auto-login if URL contains demo=true
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('demo') === 'true') {
      setDemoAutoLogin(true);
      handleDemoLogin();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(username, password);
      
      if (result.success) {
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Use pre-filled demo credentials
      const result = await login('demo', 'demopassword');
      
      if (result.success) {
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
      } else {
        // Try auto-login endpoint if regular login fails
        try {
          const response = await fetch('/api/auth/demo-login');
          if (!response.ok) {
            throw new Error('Failed to auto-login');
          }
          
          const autoLoginResult = await response.json();
          
          if (autoLoginResult.success) {
            localStorage.setItem('dashboard_auth_token', autoLoginResult.token);
            localStorage.setItem('dashboard_user', JSON.stringify({ 
              username: autoLoginResult.username,
              isAdmin: autoLoginResult.isAdmin,
              isDemoUser: true
            }));
            
            if (onLoginSuccess) {
              onLoginSuccess({
                username: autoLoginResult.username,
                isAdmin: autoLoginResult.isAdmin,
                isDemoUser: true
              });
            }
          } else {
            setError('Demo auto-login failed. Please try manual login.');
          }
        } catch (autoLoginErr) {
          setError('Demo auto-login failed. Please try manual login.');
          console.error('Auto-login error:', autoLoginErr);
        }
      }
    } catch (err) {
      setError('Demo login failed. Please try again.');
      console.error('Demo login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // If demo auto-login is in progress, show a loading indicator
  if (demoAutoLogin && isLoading) {
    return (
      <div className="demo-auto-login">
        <div className="loading-spinner"></div>
        <p>Logging in to demo dashboard...</p>
        
        <style jsx="true">{`
          .demo-auto-login {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            text-align: center;
          }
          .loading-spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 4px solid #3498db;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="login-form-container">
      <div className="demo-indicator">DEMO VERSION</div>
      
      <div className="login-form-card">
        <h2 className="text-2xl font-bold mb-6">DevOps Career Dashboard <span className="demo-badge">DEMO</span></h2>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <div className="demo-notice">
          <p>This is a demo version with sample data.</p>
          <p>You can log in with the pre-filled demo credentials or click the Demo Login button.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Signing in...' : 'Demo Login (One-Click)'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <a href="https://github.com/joshuamichaelhall/devops-career-dashboard" 
             className="text-sm text-indigo-600 hover:text-indigo-500"
             target="_blank"
             rel="noopener noreferrer">
            View Source Code on GitHub
          </a>
        </div>
      </div>
      
      <style jsx="true">{`
        .login-form-container {
          position: relative;
          max-width: 400px;
          margin: 2rem auto;
          padding: 0 1rem;
        }
        .login-form-card {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        .demo-indicator {
          background: linear-gradient(135deg, #f5365c 0%, #f56036 100%);
          color: white;
          font-weight: bold;
          text-align: center;
          padding: 0.5rem;
          border-radius: 8px 8px 0 0;
          margin-bottom: -1px;
        }
        .demo-badge {
          display: inline-block;
          background: linear-gradient(135deg, #f5365c 0%, #f56036 100%);
          color: white;
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          vertical-align: middle;
          margin-left: 0.5rem;
        }
        .demo-notice {
          background-color: #f9f9f9;
          border-left: 4px solid #4338ca;
          padding: 1rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: #4b5563;
          border-radius: 4px;
        }
        .demo-notice p {
          margin: 0.25rem 0;
        }
      `}</style>
    </div>
  );
};

export default DemoLoginForm;