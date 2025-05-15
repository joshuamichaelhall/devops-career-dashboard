import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import TimeLogForm from './TimeLogForm';
import { useDashboard } from '../context/DashboardContext';

const WeeklyMetricsCard = () => {
  const { dashboardData, loading } = useDashboard();
  const [showTimeLogForm, setShowTimeLogForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  if (loading || !dashboardData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  const { weeklyMetrics } = dashboardData;
  
  const handleTimeLogClose = (result) => {
    setShowTimeLogForm(false);
    
    if (result?.success) {
      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };
  
  const getProgressPercentage = (actual, target) => {
    return Math.min(100, Math.round((actual / target) * 100));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Weekly Metrics</h2>
        <button
          onClick={() => setShowTimeLogForm(true)}
          className="bg-blue-600 text-white p-2 rounded-full flex items-center justify-center"
          aria-label="Log time"
        >
          <Clock size={18} />
        </button>
      </div>
      
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-2 rounded mb-4 text-sm">
          {successMessage}
        </div>
      )}
      
      {showTimeLogForm ? (
        <TimeLogForm onClose={handleTimeLogClose} />
      ) : (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Learning</span>
              <span className="font-medium">{weeklyMetrics.learningHours}/25 hours</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${getProgressPercentage(weeklyMetrics.learningHours, 25)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Projects</span>
              <span className="font-medium">{weeklyMetrics.projectHours}/12.5 hours</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${getProgressPercentage(weeklyMetrics.projectHours, 12.5)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Networking</span>
              <span className="font-medium">{weeklyMetrics.networkingHours}/7.5 hours</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-500 h-2.5 rounded-full"
                style={{ width: `${getProgressPercentage(weeklyMetrics.networkingHours, 7.5)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Content Creation</span>
              <span className="font-medium">{weeklyMetrics.contentCreationHours || 0}/5 hours</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-yellow-500 h-2.5 rounded-full"
                style={{ width: `${getProgressPercentage(weeklyMetrics.contentCreationHours || 0, 5)}%` }}
              ></div>
            </div>
          </div>
          
          {weeklyMetrics.jobSearchHours > 0 && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Job Search</span>
                <span className="font-medium">{weeklyMetrics.jobSearchHours} hours</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-pink-500 h-2.5 rounded-full"
                  style={{ width: `${Math.min(100, weeklyMetrics.jobSearchHours * 10)}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Hours</span>
              <span className="text-lg font-bold text-blue-600">{weeklyMetrics.totalHours}/50</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${getProgressPercentage(weeklyMetrics.totalHours, 50)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyMetricsCard;