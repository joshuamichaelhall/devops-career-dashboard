import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { getScheduleTemplate } from '../data/templates/schedule-template';

const WeeklyScheduleStats = () => {
  const { dashboardData, updateDashboardSection } = useDashboard();
  const [scheduleType, setScheduleType] = useState('fullTime');
  const [weeklyHourTracking, setWeeklyHourTracking] = useState([]);
  const [targetHours, setTargetHours] = useState({});
  const [totalByCategory, setTotalByCategory] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  
  if (!dashboardData || !dashboardData.schedule) return null;
  
  // Load schedule data based on selected type
  useEffect(() => {
    const scheduleTemplate = getScheduleTemplate(scheduleType);
    
    // Default weekly tracking data
    const defaultWeeklyTracking = [
      { day: 'Monday', learning: 8, projects: 2.5, networking: 1, content: 1, total: 12.5 },
      { day: 'Tuesday', learning: 8, projects: 3, networking: 1, content: 0, total: 12 },
      { day: 'Wednesday', learning: 6.5, projects: 2.5, networking: 1.5, content: 1.5, total: 12 },
      { day: 'Thursday', learning: 5, projects: 2, networking: 1, content: 0, total: 8 },
      { day: 'Friday', learning: 5.5, projects: 2.5, networking: 1.5, content: 1.5, total: 11 },
      { day: 'Saturday', learning: 0, projects: 5.5, networking: 1.5, content: 2, total: 9 },
      { day: 'Sunday', learning: 0, projects: 0, networking: 0, content: 0, total: 0 },
    ];
    
    // Use schedule data if available, otherwise use defaults
    setWeeklyHourTracking(dashboardData.weeklyTracking || defaultWeeklyTracking);
    setTargetHours(scheduleTemplate.timeAllocation);
    
    // Calculate totals
    const newTotalByCategory = (dashboardData.weeklyTracking || defaultWeeklyTracking).reduce(
      (acc, day) => {
        acc.learning += day.learning;
        acc.projects += day.projects;
        acc.networking += day.networking;
        acc.content += day.content;
        acc.total += day.total;
        return acc;
      },
      { learning: 0, projects: 0, networking: 0, content: 0, total: 0 }
    );
    
    setTotalByCategory(newTotalByCategory);
  }, [scheduleType, dashboardData.weeklyTracking]);
  
  // Handle schedule type change
  const handleScheduleTypeChange = async (type) => {
    setScheduleType(type);
    const scheduleTemplate = getScheduleTemplate(type);
    
    // Update target hours based on schedule type
    setTargetHours(scheduleTemplate.timeAllocation);
    
    try {
      // Update backend with new schedule type
      await updateDashboardSection('scheduleType', type);
    } catch (error) {
      console.error('Failed to update schedule type:', error);
    }
  };
  
  // Handle hour value change in edit mode
  const handleHourChange = (dayIndex, category, value) => {
    if (!isEditMode) return;
    
    const newValue = parseFloat(value) || 0;
    const updatedTracking = [...weeklyHourTracking];
    updatedTracking[dayIndex][category] = newValue;
    
    // Recalculate daily total
    updatedTracking[dayIndex].total = 
      updatedTracking[dayIndex].learning + 
      updatedTracking[dayIndex].projects + 
      updatedTracking[dayIndex].networking + 
      updatedTracking[dayIndex].content;
    
    setWeeklyHourTracking(updatedTracking);
  };
  
  // Save updated weekly schedule
  const saveWeeklySchedule = async () => {
    try {
      // Update backend with new weekly tracking data
      await updateDashboardSection('weeklyTracking', weeklyHourTracking);
      setIsEditMode(false);
    } catch (error) {
      console.error('Failed to update weekly schedule:', error);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Weekly Hour Tracking</h3>
        
        <div className="flex space-x-2">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Schedule:</label>
            <select 
              value={scheduleType} 
              onChange={(e) => handleScheduleTypeChange(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              disabled={isEditMode}
            >
              <option value="fullTime">Full-Time (50h)</option>
              <option value="partTime">Part-Time (20h)</option>
              <option value="weekend">Weekend (20h)</option>
            </select>
          </div>
          
          {isEditMode ? (
            <button 
              onClick={saveWeeklySchedule}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Schedule
            </button>
          ) : (
            <button 
              onClick={() => setIsEditMode(true)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit Schedule
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mon</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tue</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wed</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thu</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fri</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sat</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sun</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-2 px-3 text-sm font-medium">Learning</td>
              <td className="py-2 px-3 text-sm">{targetHours.learning}</td>
              {weeklyHourTracking.map((day, idx) => (
                <td key={idx} className="py-2 px-3 text-sm">
                  {isEditMode ? (
                    <input
                      type="number"
                      value={day.learning}
                      onChange={(e) => handleHourChange(idx, 'learning', e.target.value)}
                      className="w-12 border rounded px-1 py-0.5 text-sm"
                      step="0.5"
                      min="0"
                    />
                  ) : (
                    day.learning
                  )}
                </td>
              ))}
              <td className="py-2 px-3 text-sm font-bold">{totalByCategory.learning}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-sm font-medium">Projects</td>
              <td className="py-2 px-3 text-sm">{targetHours.projects}</td>
              {weeklyHourTracking.map((day, idx) => (
                <td key={idx} className="py-2 px-3 text-sm">
                  {isEditMode ? (
                    <input
                      type="number"
                      value={day.projects}
                      onChange={(e) => handleHourChange(idx, 'projects', e.target.value)}
                      className="w-12 border rounded px-1 py-0.5 text-sm"
                      step="0.5"
                      min="0"
                    />
                  ) : (
                    day.projects
                  )}
                </td>
              ))}
              <td className="py-2 px-3 text-sm font-bold">{totalByCategory.projects}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-sm font-medium">Networking</td>
              <td className="py-2 px-3 text-sm">{targetHours.networking}</td>
              {weeklyHourTracking.map((day, idx) => (
                <td key={idx} className="py-2 px-3 text-sm">
                  {isEditMode ? (
                    <input
                      type="number"
                      value={day.networking}
                      onChange={(e) => handleHourChange(idx, 'networking', e.target.value)}
                      className="w-12 border rounded px-1 py-0.5 text-sm"
                      step="0.5"
                      min="0"
                    />
                  ) : (
                    day.networking
                  )}
                </td>
              ))}
              <td className="py-2 px-3 text-sm font-bold">{totalByCategory.networking}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-sm font-medium">Content Creation</td>
              <td className="py-2 px-3 text-sm">{targetHours.content}</td>
              {weeklyHourTracking.map((day, idx) => (
                <td key={idx} className="py-2 px-3 text-sm">
                  {isEditMode ? (
                    <input
                      type="number"
                      value={day.content}
                      onChange={(e) => handleHourChange(idx, 'content', e.target.value)}
                      className="w-12 border rounded px-1 py-0.5 text-sm"
                      step="0.5"
                      min="0"
                    />
                  ) : (
                    day.content
                  )}
                </td>
              ))}
              <td className="py-2 px-3 text-sm font-bold">{totalByCategory.content}</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-2 px-3 text-sm font-bold">Weekly Total</td>
              <td className="py-2 px-3 text-sm font-bold">{targetHours.total}</td>
              {weeklyHourTracking.map((day, idx) => (
                <td key={idx} className="py-2 px-3 text-sm font-bold">{day.total}</td>
              ))}
              <td className="py-2 px-3 text-sm font-bold">{totalByCategory.total}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-bold">Weekly Goals</h3>
        <ul className="space-y-2 list-disc pl-5">
          <li className="text-sm">Complete ___ certification modules/chapters</li>
          <li className="text-sm">Implement ___ infrastructure components</li>
          <li className="text-sm">Create ___ architecture diagrams</li>
          <li className="text-sm">Make ___ GitHub contributions (maintain daily streak Mon-Sat)</li>
          <li className="text-sm">Connect with ___ DevOps professionals (target: 25-30 weekly)</li>
          <li className="text-sm">Draft/publish ___ technical articles or documentation</li>
          <li className="text-sm">Attend ___ virtual or in-person DevOps meetups</li>
          <li className="text-sm">Complete ___ hours of hands-on technical practice</li>
        </ul>
      </div>
      
      <div className="mt-6 text-center border-t pt-4 border-gray-200">
        <p className="text-xs italic text-gray-600">"Master the basics. Then practice them every day without fail." - John C. Maxwell</p>
      </div>
    </div>
  );
};

export default WeeklyScheduleStats;