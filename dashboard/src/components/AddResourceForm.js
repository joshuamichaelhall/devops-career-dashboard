import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

const AddResourceForm = ({ onClose }) => {
  const { addLearningResource } = useDashboard();
  const [resourceName, setResourceName] = useState('');
  const [resourceType, setResourceType] = useState('Course');
  const [priority, setPriority] = useState('P1');
  const [status, setStatus] = useState('Scheduled');
  const [targetMonth, setTargetMonth] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const resourceTypes = ['Course', 'Book', 'Tutorial', 'Documentation', 'Workshop', 'Video Series'];
  const priorities = ['P1', 'P2', 'P3', 'P4'];
  const statusOptions = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resourceName.trim()) {
      setError('Resource name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Create resource data object
      const resourceData = {
        name: resourceName.trim(),
        type: resourceType,
        priority,
        targetMonth,
        status
      };
      
      // Add resource using context API
      await addLearningResource(resourceData);
      
      // Reset form
      setResourceName('');
      
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Error adding resource:', err);
      setError('Failed to add resource. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-bold mb-4">Add Learning Resource</h3>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resource Name
          </label>
          <input
            type="text"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter resource name"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource Type
            </label>
            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            >
              {resourceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Month
            </label>
            <select
              value={targetMonth}
              onChange={(e) => setTargetMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            >
              {[...Array(24)].map((_, i) => (
                <option key={i+1} value={i+1}>
                  Month {i+1}
                </option>
              ))}
            </select>
          </div>
        </div>
        
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Resource'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddResourceForm;