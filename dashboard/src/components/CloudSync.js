import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

/**
 * Cloud Sync Component
 * Allows users to sync their dashboard data with cloud storage services
 */
const CloudSync = ({ onClose }) => {
  const { dashboardData } = useDashboard();
  const [provider, setProvider] = useState('dropbox'); // dropbox, google, github
  const [syncStatus, setSyncStatus] = useState(null); // null, 'syncing', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState(null);
  const [authCode, setAuthCode] = useState('');
  const [folderPath, setFolderPath] = useState('DevOps-Dashboard');
  
  // Sync providers
  const syncProviders = [
    { id: 'dropbox', name: 'Dropbox', icon: '📦' },
    { id: 'google', name: 'Google Drive', icon: '🗄️' },
    { id: 'github', name: 'GitHub Gist', icon: '🐱' }
  ];
  
  // Function to start the sync process
  const startSync = async () => {
    try {
      setErrorMessage(null);
      setSyncStatus('syncing');
      
      // This is a mock implementation - in reality, this would use the provider's APIs
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Check for required inputs
      if (provider === 'github' && !authCode) {
        throw new Error('GitHub authentication token is required');
      }
      
      // Handle different providers
      switch (provider) {
        case 'dropbox':
          // Mock Dropbox sync
          console.log('Syncing with Dropbox to', folderPath);
          break;
        case 'google':
          // Mock Google Drive sync
          console.log('Syncing with Google Drive to', folderPath);
          break;
        case 'github':
          // Mock GitHub Gist sync
          console.log('Syncing with GitHub Gist using token', authCode);
          break;
        default:
          throw new Error('Unknown provider');
      }
      
      setSyncStatus('success');
      
      // Auto-close after success
      setTimeout(() => {
        if (onClose) onClose();
      }, 3000);
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      setErrorMessage(error.message);
    }
  };
  
  // Render provider-specific form fields
  const renderProviderFields = () => {
    switch (provider) {
      case 'dropbox':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Folder Path</label>
            <input
              type="text"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="/DevOps-Dashboard"
            />
            <p className="mt-1 text-xs text-gray-500">
              Your dashboard will be saved as {folderPath}/dashboard-data.json
            </p>
            
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded text-sm">
              <div className="font-medium mb-1">Connect with Dropbox:</div>
              <p className="mb-2">This will open Dropbox authorization in a new window.</p>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                onClick={() => alert('In a real implementation, this would open the Dropbox OAuth flow.')}
              >
                Connect to Dropbox
              </button>
            </div>
          </div>
        );
        
      case 'google':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Folder Path</label>
            <input
              type="text"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="DevOps Dashboard"
            />
            
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded text-sm">
              <div className="font-medium mb-1">Connect with Google Drive:</div>
              <p className="mb-2">This will open Google authorization in a new window.</p>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                onClick={() => alert('In a real implementation, this would open the Google OAuth flow.')}
              >
                Connect to Google Drive
              </button>
            </div>
          </div>
        );
        
      case 'github':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">GitHub Personal Access Token</label>
            <input
              type="password"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ghp_xxxxxxxxxxxxxxxx"
            />
            <p className="mt-1 text-xs text-gray-500">
              Token requires 'gist' scope. <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Generate token</a>
            </p>
            
            <label className="block text-sm font-medium mt-4 mb-2">Gist Description</label>
            <input
              type="text"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="DevOps Career Dashboard Data"
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Convert dashboard data size to readable format
  const getDataSize = () => {
    const jsonString = JSON.stringify(dashboardData);
    const bytes = new TextEncoder().encode(jsonString).length;
    
    if (bytes < 1024) {
      return `${bytes} bytes`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };
  
  return (
    <div className="cloud-sync bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cloud Sync</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <p className="mb-6">
        Sync your dashboard data with cloud storage to access it from multiple devices and keep it backed up.
      </p>
      
      {/* Sync provider selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Sync Provider:</label>
        <div className="grid grid-cols-3 gap-3">
          {syncProviders.map(syncProvider => (
            <div 
              key={syncProvider.id}
              className={`border rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 ${
                provider === syncProvider.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => setProvider(syncProvider.id)}
            >
              <div className="text-3xl mb-2">{syncProvider.icon}</div>
              <div className="font-medium">{syncProvider.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Provider-specific fields */}
      {renderProviderFields()}
      
      {/* Data summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Sync Summary:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-600">Data Size:</div>
          <div>{getDataSize()}</div>
          
          <div className="text-gray-600">Last Updated:</div>
          <div>{dashboardData?.overview?.lastUpdated || 'Unknown'}</div>
          
          <div className="text-gray-600">Selected Provider:</div>
          <div>{syncProviders.find(p => p.id === provider)?.name}</div>
        </div>
      </div>
      
      {/* Status messages */}
      {syncStatus === 'syncing' && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800 mr-2"></div>
          Syncing your dashboard data...
        </div>
      )}
      
      {syncStatus === 'success' && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          ✓ Dashboard data synced successfully!
        </div>
      )}
      
      {syncStatus === 'error' && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          ⚠️ Sync error: {errorMessage || 'Unknown error occurred'}
        </div>
      )}
      
      {/* Action button */}
      <button
        onClick={startSync}
        disabled={syncStatus === 'syncing'}
        className={`px-4 py-2 rounded w-full ${
          syncStatus === 'syncing'
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Dashboard Data'}
      </button>
      
      {/* Help text */}
      <div className="mt-6 text-sm text-gray-500">
        <div className="font-medium mb-1">Privacy Note:</div>
        <p>
          Your data is stored in your personal cloud storage and is not shared with anyone.
          Authentication is handled directly through the provider's secure login process.
        </p>
      </div>
    </div>
  );
};

export default CloudSync;