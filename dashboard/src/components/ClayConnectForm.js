import React, { useState, useEffect } from 'react';
import { connectToClayApi, checkClayConnection } from '../services/clayApi';

const ClayConnectForm = ({ onSuccess }) => {
  const [apiKey, setApiKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, lastConnected: null });
  
  // Check connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const status = await checkClayConnection();
        setConnectionStatus(status);
      } catch (err) {
        console.error('Error checking connection:', err);
        setConnectionStatus({ connected: false });
      }
    };
    
    checkConnection();
  }, []);
  
  const handleConnect = async (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }
    
    try {
      setIsConnecting(true);
      setError('');
      
      const result = await connectToClayApi(apiKey);
      
      if (result.success) {
        setConnectionStatus({ connected: true, lastConnected: new Date().toISOString() });
        setApiKey('');
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(result.error || 'Failed to connect to Clay CRM');
      }
    } catch (err) {
      console.error('Error connecting to Clay:', err);
      setError('Failed to connect to Clay CRM. Please check your API key and try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-bold mb-4">Clay CRM Connection</h3>
      
      {connectionStatus.connected ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">🟢 Connected to Clay CRM</p>
          {connectionStatus.lastConnected && (
            <p className="text-sm">Last connected: {formatDate(connectionStatus.lastConnected)}</p>
          )}
          <button
            onClick={() => setConnectionStatus({ connected: false })}
            className="mt-2 text-sm bg-white px-3 py-1 rounded border border-green-400 hover:bg-green-50"
          >
            Reconnect
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          
          <p className="text-sm text-gray-600 mb-4">
            Connect your Clay CRM account to track your networking progress and relationships.
            You can find your API key in your Clay CRM account settings.
          </p>
          
          <form onSubmit={handleConnect}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clay CRM API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your Clay CRM API key"
                disabled={isConnecting}
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect Clay CRM'}
              </button>
            </div>
          </form>
          
          <p className="text-xs text-gray-500 mt-4">
            Don't have a Clay CRM account? <a href="https://clay.earth" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">Sign up here</a>
          </p>
        </>
      )}
    </div>
  );
};

export default ClayConnectForm;