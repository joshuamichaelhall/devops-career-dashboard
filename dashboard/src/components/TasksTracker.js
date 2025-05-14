import React, { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';

const TasksTracker = () => {
  const { dashboardData, loading, refreshData } = useDashboard();
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  if (loading || !dashboardData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { goals } = dashboardData;
  
  // Group tasks by status
  const pendingTasks = goals.filter(task => !task.completed);
  const completedTasks = goals.filter(task => task.completed);
  
  // Filter tasks based on the active filter
  const filterTasks = (tasks) => {
    if (activeFilter === 'all') return tasks;
    return tasks.filter(task => task.category.toLowerCase() === activeFilter.toLowerCase());
  };
  
  const categories = ['all', 'learning', 'project', 'networking', 'content creation', 'job search'];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks Tracker</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => refreshData()}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            aria-label="Refresh data"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center"
          >
            <Plus size={18} className="mr-1" /> Add Task
          </button>
        </div>
      </div>
      
      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-3 py-1 rounded-full text-sm ${
              activeFilter === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {showAddForm && (
        <div className="mb-6">
          <AddTaskForm onClose={() => setShowAddForm(false)} />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Tasks */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">To Do</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {filterTasks(pendingTasks).length}
            </span>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filterTasks(pendingTasks).length > 0 ? (
              filterTasks(pendingTasks).map(task => (
                <TaskItem key={task.content} task={task} />
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No pending tasks</p>
            )}
          </div>
        </div>
        
        {/* In Progress Tasks (placeholder for future) */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">In Progress</h3>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
              0
            </span>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500 italic">No tasks in progress</p>
          </div>
        </div>
        
        {/* Completed Tasks */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Completed</h3>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {filterTasks(completedTasks).length}
            </span>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filterTasks(completedTasks).length > 0 ? (
              filterTasks(completedTasks).map(task => (
                <TaskItem key={task.content} task={task} />
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No completed tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksTracker;