import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

const ResourceProgressForm = ({ onClose }) => {
  const { dashboardData, updateLearningResource } = useDashboard();
  const [selectedResource, setSelectedResource] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const resources = dashboardData.learningResources || [];
  const statusOptions = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
  
  // Handler for resource selection
  const handleResourceSelect = (resourceId) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
      setSelectedResource(resourceId);
      setProgress(resource.progress || 0);
      setStatus(resource.status || 'Scheduled');
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedResource) {
      setError('Please select a resource');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Create update data
      const updates = {
        progress: parseInt(progress),
        status
      };
      
      // Update resource via context
      await updateLearningResource(selectedResource, updates);
      
      // Close form on success
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Error updating resource:', err);
      setError('Failed to update resource progress. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-bold mb-4">Update Resource Progress</h3>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Resource
          </label>
          <select
            value={selectedResource}
            onChange={(e) => handleResourceSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          >
            <option value="">-- Select a resource --</option>
            {resources.map(resource => (
              <option key={resource.id} value={resource.id}>
                {resource.name} ({resource.type})
              </option>
            ))}
          </select>
        </div>
        
        {selectedResource && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progress ({progress}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                className="w-full focus:outline-none"
                disabled={isSubmitting}
              />
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        
        <div className="flex justify-end space-x-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting || !selectedResource}
          >
            {isSubmitting ? 'Updating...' : 'Update Progress'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResourceProgressForm;