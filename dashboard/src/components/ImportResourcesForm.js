import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  getTrackResources, 
  getMultiTrackResources, 
  getAllResources,
  formatResourceForDashboard
} from '../data/templates/resources-template';

const ImportResourcesForm = ({ onClose }) => {
  const { dashboardData, refreshData } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [importOption, setImportOption] = useState('track');
  const [selectedTracks, setSelectedTracks] = useState(['aws']);
  const [selectedResources, setSelectedResources] = useState([]);
  
  // Define track options
  const trackOptions = [
    { id: 'aws', name: 'AWS/Cloud' },
    { id: 'terraform', name: 'Terraform/IaC' },
    { id: 'kubernetes', name: 'Kubernetes' },
    { id: 'devops', name: 'General DevOps' },
    { id: 'linux', name: 'Linux' },
    { id: 'security', name: 'Security' }
  ];
  
  // Get resources based on selected tracks
  const getResourcesForDisplay = () => {
    switch (importOption) {
      case 'track':
        return getMultiTrackResources(selectedTracks);
      case 'all':
        return getAllResources();
      default:
        return getTrackResources('devops');
    }
  };
  
  // Available resources for selection
  const availableResources = getResourcesForDisplay();
  
  // Toggle track selection
  const toggleTrackSelection = (trackId) => {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks(selectedTracks.filter(id => id !== trackId));
    } else {
      setSelectedTracks([...selectedTracks, trackId]);
    }
  };
  
  // Toggle resource selection
  const toggleResourceSelection = (resourceName) => {
    if (selectedResources.includes(resourceName)) {
      setSelectedResources(selectedResources.filter(name => name !== resourceName));
    } else {
      setSelectedResources([...selectedResources, resourceName]);
    }
  };
  
  // Handle resource import
  const handleImport = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      if (selectedResources.length === 0) {
        setError('Please select at least one resource to import');
        return;
      }
      
      // Filter selected resources
      const resourcesToImport = availableResources
        .filter(resource => selectedResources.includes(resource.name))
        .map(resource => formatResourceForDashboard(resource));
      
      // Combine with existing resources
      const existingResources = dashboardData.learningResources || [];
      const existingResourceNames = existingResources.map(r => r.name);
      
      // Filter out any resources that already exist (by name)
      const newResources = resourcesToImport.filter(
        resource => !existingResourceNames.includes(resource.name)
      );
      
      if (newResources.length === 0) {
        setError('All selected resources already exist in your dashboard');
        setLoading(false);
        return;
      }
      
      // Combine existing and new resources
      const updatedResources = [...existingResources, ...newResources];
      
      // Update resources in the backend
      const response = await fetch('http://localhost:3001/api/data/learningResources', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedResources),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update learning resources');
      }
      
      setSuccess(`Successfully imported ${newResources.length} learning resources`);
      
      // Refresh data to update UI
      await refreshData();
      
      // Close form after success (optional)
      if (onClose && newResources.length > 0) {
        setTimeout(() => onClose(), 1500);
      }
    } catch (err) {
      console.error('Error importing learning resources:', err);
      setError('Failed to import resources. Check console for details.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-bold mb-4">Import Learning Resources</h3>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">
          {success}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Import Option
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="importOption"
              value="track"
              checked={importOption === 'track'}
              onChange={() => setImportOption('track')}
              className="mr-2"
            />
            <span>Import by Track</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="importOption"
              value="all"
              checked={importOption === 'all'}
              onChange={() => setImportOption('all')}
              className="mr-2"
            />
            <span>Import All Resources</span>
          </label>
        </div>
      </div>
      
      {importOption === 'track' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Tracks
          </label>
          <div className="grid grid-cols-2 gap-2">
            {trackOptions.map(track => (
              <label 
                key={track.id}
                className={`flex items-center p-2 border rounded cursor-pointer ${
                  selectedTracks.includes(track.id) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTracks.includes(track.id)}
                  onChange={() => toggleTrackSelection(track.id)}
                  className="mr-2"
                />
                {track.name}
              </label>
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Resources to Import
          </label>
          <div className="text-xs text-gray-500">
            {selectedResources.length} of {availableResources.length} selected
          </div>
        </div>
        <div className="h-60 overflow-y-auto border border-gray-200 rounded p-2">
          {availableResources.length > 0 ? (
            <div className="space-y-2">
              {availableResources.map((resource, index) => (
                <div
                  key={index}
                  className={`p-2 border rounded cursor-pointer ${
                    selectedResources.includes(resource.name)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => toggleResourceSelection(resource.name)}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{resource.name}</span>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        resource.priority === 'high' ? 'bg-red-100 text-red-800' :
                        resource.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {resource.priority}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                  {resource.description && (
                    <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                  )}
                  {resource.provider && (
                    <p className="text-xs text-gray-500 mt-1">Provider: {resource.provider}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No resources available for selected criteria</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedResources.length === availableResources.length}
              onChange={() => {
                if (selectedResources.length === availableResources.length) {
                  setSelectedResources([]);
                } else {
                  setSelectedResources(availableResources.map(r => r.name));
                }
              }}
              className="mr-2"
            />
            Select All
          </label>
        </div>
        <div>
          <button
            onClick={() => setSelectedResources([])}
            className="text-blue-600 hover:text-blue-800"
            disabled={selectedResources.length === 0}
          >
            Clear Selection
          </button>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            Cancel
          </button>
        )}
        
        <button
          onClick={handleImport}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading || selectedResources.length === 0}
        >
          {loading ? 'Importing...' : 'Import Selected Resources'}
        </button>
      </div>
    </div>
  );
};

export default ImportResourcesForm;