import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const TaskItem = ({ task }) => {
  const { completeTask } = useDashboard();
  
  const handleToggleComplete = async () => {
    try {
      await completeTask(task.content, !task.completed);
    } catch (error) {
      console.error('Failed to update task:', error);
      // Could add toast notification here
    }
  };
  
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'learning':
        return 'bg-blue-100 text-blue-800';
      case 'project':
        return 'bg-green-100 text-green-800';
      case 'networking':
        return 'bg-purple-100 text-purple-800';
      case 'content creation':
        return 'bg-yellow-100 text-yellow-800';
      case 'job search':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className={`p-3 rounded border ${task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'} mb-2`}>
      <div className="flex items-start">
        <button 
          onClick={handleToggleComplete}
          className="mt-0.5 mr-2 flex-shrink-0 focus:outline-none"
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.content}
            </p>
            <div className="flex items-center mt-1 sm:mt-0">
              <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(task.category)}`}>
                {task.category}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                Due: {task.dueDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;