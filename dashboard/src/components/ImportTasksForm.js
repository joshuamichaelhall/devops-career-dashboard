import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { getTrackTasks, getMultiTrackTasks } from '../data/templates/tasks-template';

const ImportTasksForm = ({ onClose }) => {
  const { dashboardData, refreshData } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [selectedTracks, setSelectedTracks] = useState(['devops']);
  const [includeRecurring, setIncludeRecurring] = useState(true);
  const [selectedTasks, setSelectedTasks] = useState([]);
  
  // Track options
  const trackOptions = [
    { id: 'aws', name: 'AWS/Cloud' },
    { id: 'terraform', name: 'Infrastructure as Code' },
    { id: 'kubernetes', name: 'Kubernetes' },
    { id: 'cicd', name: 'CI/CD Pipelines' },
    { id: 'devops', name: 'General DevOps' }
  ];
  
  // Get tasks based on selected tracks
  const getTasks = () => {
    if (selectedTracks.length === 1) {
      return getTrackTasks(selectedTracks[0], includeRecurring);
    } else {
      return getMultiTrackTasks(selectedTracks, includeRecurring);
    }
  };
  
  const tasks = getTasks();
  
  // Combine all tasks into a flat array for display and selection
  const getAllTasksFlat = () => {
    const oneTimeTasks = tasks.onetime || [];
    const recurringTasks = tasks.recurring ? [
      ...(tasks.recurring.daily || []).map(task => ({ ...task, frequency: 'Daily' })),
      ...(tasks.recurring.weekly || []).map(task => ({ ...task, frequency: 'Weekly' })),
      ...(tasks.recurring.monthly || []).map(task => ({ ...task, frequency: 'Monthly' }))
    ] : [];
    
    return [...oneTimeTasks, ...recurringTasks];
  };
  
  const allTasks = getAllTasksFlat();
  
  // Toggle track selection
  const toggleTrackSelection = (trackId) => {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks(selectedTracks.filter(id => id !== trackId));
    } else {
      setSelectedTracks([...selectedTracks, trackId]);
    }
    
    // Reset selected tasks when changing tracks
    setSelectedTasks([]);
  };
  
  // Toggle task selection
  const toggleTaskSelection = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };
  
  // Get category color class
  const getCategoryColor = (category) => {
    switch (category) {
      case 'aws':
      case 'terraform':
      case 'kubernetes':
      case 'cicd':
        return 'bg-blue-100 text-blue-800';
      case 'learning':
        return 'bg-green-100 text-green-800';
      case 'project':
        return 'bg-purple-100 text-purple-800';
      case 'certification':
        return 'bg-yellow-100 text-yellow-800';
      case 'networking':
        return 'bg-pink-100 text-pink-800';
      case 'skill':
        return 'bg-indigo-100 text-indigo-800';
      case 'career':
        return 'bg-teal-100 text-teal-800';
      case 'content':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get priority color class
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle form submission
  const handleImport = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      if (selectedTasks.length === 0) {
        setError('Please select at least one task to import');
        setLoading(false);
        return;
      }
      
      // Get selected tasks from the full task list
      const tasksToImport = allTasks.filter(task => selectedTasks.includes(task.id));
      
      // Format tasks for import (remove frequency field if present)
      const formattedTasks = tasksToImport.map(task => {
        const { frequency, ...taskData } = task;
        return taskData;
      });
      
      // Combine with existing goals/tasks
      const existingGoals = dashboardData.goals || [];
      
      // Check for duplicate task content to avoid duplication
      const existingContents = existingGoals.map(goal => goal.content);
      const newTasks = formattedTasks.filter(task => 
        !existingContents.includes(task.content)
      );
      
      if (newTasks.length === 0) {
        setError('All selected tasks already exist in your dashboard');
        setLoading(false);
        return;
      }
      
      // Update goals in the backend
      const updatedGoals = [...existingGoals, ...newTasks];
      
      const response = await fetch('http://localhost:3001/api/data/goals', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGoals),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update tasks');
      }
      
      // Also update dashboard overview metrics
      const updatedOverview = {
        ...dashboardData.overview,
        totalGoals: updatedGoals.length,
        completedGoals: updatedGoals.filter(goal => goal.completed).length
      };
      
      await fetch('http://localhost:3001/api/data/overview', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOverview),
      });
      
      setSuccess(`Successfully imported ${newTasks.length} tasks`);
      
      // Refresh data
      await refreshData();
      
      // Close form after success
      if (onClose && newTasks.length > 0) {
        setTimeout(() => onClose(), 1500);
      }
    } catch (err) {
      console.error('Error importing tasks:', err);
      setError('Failed to import tasks. Check console for details.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-bold mb-4">Import Tasks</h3>
      
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Tracks
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
      
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <input
            type="checkbox"
            checked={includeRecurring}
            onChange={() => setIncludeRecurring(!includeRecurring)}
            className="mr-2"
          />
          Include Recurring Tasks (Daily, Weekly, Monthly)
        </label>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Tasks to Import
          </label>
          <div className="text-xs text-gray-500">
            {selectedTasks.length} of {allTasks.length} selected
          </div>
        </div>
        <div className="h-60 overflow-y-auto border border-gray-200 rounded p-2">
          {allTasks.length > 0 ? (
            <div className="space-y-2">
              {allTasks.map(task => (
                <div
                  key={task.id}
                  className={`p-2 border rounded cursor-pointer ${
                    selectedTasks.includes(task.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => toggleTaskSelection(task.id)}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{task.content}</span>
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.frequency && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {task.frequency}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`px-2 py-1 text-xs rounded ${getCategoryColor(task.category)}`}>
                      {task.category}
                    </span>
                    {task.due && (
                      <span className="text-xs text-gray-500">
                        Due: {typeof task.due === 'string' && task.due.includes('-') 
                          ? task.due 
                          : task.due}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No tasks available for selected tracks</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedTasks.length === allTasks.length}
              onChange={() => {
                if (selectedTasks.length === allTasks.length) {
                  setSelectedTasks([]);
                } else {
                  setSelectedTasks(allTasks.map(task => task.id));
                }
              }}
              className="mr-2"
            />
            Select All
          </label>
        </div>
        <div>
          <button
            onClick={() => setSelectedTasks([])}
            className="text-blue-600 hover:text-blue-800"
            disabled={selectedTasks.length === 0}
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
          disabled={loading || selectedTasks.length === 0}
        >
          {loading ? 'Importing...' : 'Import Selected Tasks'}
        </button>
      </div>
    </div>
  );
};

export default ImportTasksForm;