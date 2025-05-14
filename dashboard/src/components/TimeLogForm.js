import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

const TimeLogForm = ({ onClose }) => {
  const { logTimeEntry } = useDashboard();
  const [category, setCategory] = useState('Learning');
  const [hours, setHours] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const categories = [
    'Learning', 
    'Project', 
    'Networking', 
    'Job Search',
    'Content Creation'
  ];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hours || isNaN(hours) || parseFloat(hours) <= 0) {
      setError('Please enter a valid number of hours');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await logTimeEntry(category, hours, date);
      
      // Reset form
      setHours('');
      setError('');
      
      if (onClose) {
        onClose({ success: true, message: `${hours} hours logged for ${category}` });
      }
    } catch (error) {
      console.error('Failed to log time:', error);
      setError('Failed to log time. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold mb-4">Log Time</h3>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
              Hours
            </label>
            <input
              type="number"
              id="hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter number of hours"
              step="0.5"
              min="0.5"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          {onClose && (
            <button
              type="button"
              onClick={() => onClose({ success: false })}
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
            {isSubmitting ? 'Logging...' : 'Log Time'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TimeLogForm;