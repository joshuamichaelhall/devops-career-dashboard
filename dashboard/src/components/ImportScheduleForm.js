import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  getScheduleTemplate, 
  getTimeAllocation, 
  createCustomSchedule 
} from '../data/templates/schedule-template';

const ImportScheduleForm = ({ onClose }) => {
  const { dashboardData, refreshData } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scheduleType, setScheduleType] = useState('fullTime');
  const [focusAreas, setFocusAreas] = useState([]);
  const [customizeSchedule, setCustomizeSchedule] = useState(false);
  
  // Schedule type options
  const scheduleTypes = [
    { id: 'fullTime', name: 'Full-Time (50 hours/week)', description: 'Intensive schedule for career changers or full-time learners' },
    { id: 'partTime', name: 'Part-Time (20 hours/week)', description: 'Balanced schedule for working professionals' },
    { id: 'weekend', name: 'Weekend-Focused (20 hours/week)', description: 'Concentrated on weekends with minimal weekday commitment' }
  ];
  
  // Focus area options
  const focusAreaOptions = [
    { id: 'AWS', name: 'AWS Cloud' },
    { id: 'Terraform', name: 'Terraform/IaC' },
    { id: 'Kubernetes', name: 'Kubernetes/Containers' },
    { id: 'Linux', name: 'Linux Administration' },
    { id: 'CI/CD', name: 'CI/CD Pipeline' },
    { id: 'Security', name: 'Cloud Security' },
    { id: 'Monitoring', name: 'Monitoring & Observability' },
    { id: 'Scripting', name: 'Scripting & Automation' }
  ];
  
  // Toggle focus area selection
  const toggleFocusArea = (areaId) => {
    if (focusAreas.includes(areaId)) {
      setFocusAreas(focusAreas.filter(id => id !== areaId));
    } else {
      setFocusAreas([...focusAreas, areaId]);
    }
  };
  
  // Handle form submission to import schedule
  const handleImport = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Generate the schedule based on selected options
      let scheduleToImport;
      
      if (customizeSchedule && focusAreas.length > 0) {
        scheduleToImport = createCustomSchedule(scheduleType, focusAreas);
      } else {
        scheduleToImport = getScheduleTemplate(scheduleType);
      }
      
      // Update weeklyMetrics with the new time allocation
      const timeAllocation = getTimeAllocation(scheduleType);
      const updatedWeeklyMetrics = {
        ...dashboardData.weeklyMetrics,
        targetHours: timeAllocation.total,
        learningHours: dashboardData.weeklyMetrics.learningHours || 0,
        projectHours: dashboardData.weeklyMetrics.projectHours || 0,
        networkingHours: dashboardData.weeklyMetrics.networkingHours || 0,
        contentCreationHours: dashboardData.weeklyMetrics.contentCreationHours || 0
      };
      
      // Update schedule in the dashboard data
      const updatedDashboardData = {
        ...dashboardData,
        schedule: scheduleToImport,
        weeklyMetrics: updatedWeeklyMetrics
      };
      
      // Update backend via API - first update schedule
      const scheduleResponse = await fetch('http://localhost:3001/api/data/schedule', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleToImport),
      });
      
      if (!scheduleResponse.ok) {
        throw new Error('Failed to update schedule');
      }
      
      // Update weekly metrics
      const metricsResponse = await fetch('http://localhost:3001/api/data/weeklyMetrics', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedWeeklyMetrics),
      });
      
      if (!metricsResponse.ok) {
        throw new Error('Failed to update weekly metrics');
      }
      
      setSuccess(`Successfully imported ${scheduleType} schedule`);
      
      // Refresh data to update UI
      await refreshData();
      
      // Close form after success (optional)
      if (onClose) {
        setTimeout(() => onClose(), 1500);
      }
    } catch (err) {
      console.error('Error importing schedule:', err);
      setError('Failed to import schedule. Check console for details.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-bold mb-4">Import Weekly Schedule</h3>
      
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
          Select Schedule Type
        </label>
        <div className="space-y-2">
          {scheduleTypes.map(type => (
            <label
              key={type.id}
              className={`flex items-start p-3 border rounded cursor-pointer ${
                scheduleType === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="scheduleType"
                value={type.id}
                checked={scheduleType === type.id}
                onChange={() => setScheduleType(type.id)}
                className="mt-1 mr-2"
              />
              <div>
                <div className="font-medium">{type.name}</div>
                <div className="text-sm text-gray-500">{type.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <input
            type="checkbox"
            checked={customizeSchedule}
            onChange={() => setCustomizeSchedule(!customizeSchedule)}
            className="mr-2"
          />
          Customize Learning Focus Areas
        </label>
        
        {customizeSchedule && (
          <div className="mt-2">
            <div className="text-sm text-gray-600 mb-2">
              Select focus areas to customize your learning schedule:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {focusAreaOptions.map(area => (
                <label
                  key={area.id}
                  className={`flex items-center p-2 border rounded cursor-pointer ${
                    focusAreas.includes(area.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={focusAreas.includes(area.id)}
                    onChange={() => toggleFocusArea(area.id)}
                    className="mr-2"
                  />
                  {area.name}
                </label>
              ))}
            </div>
            {focusAreas.length === 0 && customizeSchedule && (
              <div className="text-sm text-yellow-600 mt-2">
                Please select at least one focus area to customize your schedule.
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800 mb-4">
        <p className="font-medium">Important Note:</p>
        <p>Importing a schedule will replace your current weekly schedule. Your current progress and logged hours will be preserved.</p>
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
          disabled={loading || (customizeSchedule && focusAreas.length === 0)}
        >
          {loading ? 'Importing...' : 'Import Schedule'}
        </button>
      </div>
    </div>
  );
};

export default ImportScheduleForm;