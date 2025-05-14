import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

const AddTaskForm = ({ onClose }) => {
  const { addTask } = useDashboard();
  const [taskContent, setTaskContent] = useState('');
  const [category, setCategory] = useState('Learning');
  const [dueDate, setDueDate] = useState('This week');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const categories = [
    'Learning', 
    'Project', 
    'Networking', 
    'Content Creation', 
    'Job Search'
  ];
  
  const dueDateOptions = [
    'Today',
    'Tomorrow',
    'This week',
    'Next week',
    'This month'
  ];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!taskContent.trim()) {
      setError('Task content is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addTask(taskContent, category, dueDate);
      setTaskContent('');
      if (onClose) onClose();
    } catch (error) {
      console.error('Failed to add task:', error);
      setError('Failed to add task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold mb-4">Add New Task</h3>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="taskContent" className="block text-sm font-medium text-gray-700 mb-1">
            Task Description
          </label>
          <input
            type="text"
            id="taskContent"
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter task description"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <select
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            >
              {dueDateOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
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
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;