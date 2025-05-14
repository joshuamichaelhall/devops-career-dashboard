import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

const ProgressUpdater = ({ type, item }) => {
  const { updateProjectProgress, updateCertificationProgress } = useDashboard();
  const [progress, setProgress] = useState(item.progress);
  const [status, setStatus] = useState(item.status);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const statuses = type === 'certification' 
    ? ['Not Started', 'In Progress', 'Completed', 'Planned']
    : ['Not Started', 'Planning', 'In Progress', 'Completed'];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError('');
      
      if (type === 'certification') {
        await updateCertificationProgress(item.name, progress, status);
      } else {
        await updateProjectProgress(item.name, progress);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update progress:', error);
      setError('Failed to update progress');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStatusColor = (statusValue) => {
    switch (statusValue.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (!isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${item.progress}%` }}
            ></div>
          </div>
        </div>
        <span className="text-sm text-gray-500">{item.progress}%</span>
        {type === 'certification' && (
          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
            {item.status}
          </span>
        )}
        <button
          onClick={() => setIsEditing(true)}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
        >
          Update
        </button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-3">
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded text-xs">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-xs text-gray-600 mb-1">Progress</label>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => setProgress(parseInt(e.target.value))}
          className="w-full"
          disabled={isSubmitting}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span>{progress}%</span>
          <span>100%</span>
        </div>
      </div>
      
      {type === 'certification' && (
        <div>
          <label className="block text-xs text-gray-600 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            disabled={isSubmitting}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => {
            setProgress(item.progress);
            setStatus(item.status);
            setIsEditing(false);
          }}
          className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ProgressUpdater;