import React from 'react';
import { useDashboard } from '../context/DashboardContext';

const WeeklyScheduleStats = () => {
  const { dashboardData } = useDashboard();
  
  if (!dashboardData || !dashboardData.schedule) return null;
  
  const weeklyHourTracking = [
    { day: 'Monday', learning: 8, projects: 2.5, networking: 1, content: 1, total: 12.5 },
    { day: 'Tuesday', learning: 8, projects: 3, networking: 1, content: 0, total: 12 },
    { day: 'Wednesday', learning: 6.5, projects: 2.5, networking: 1.5, content: 1.5, total: 12 },
    { day: 'Thursday', learning: 5, projects: 2, networking: 1, content: 0, total: 8 },
    { day: 'Friday', learning: 5.5, projects: 2.5, networking: 1.5, content: 1.5, total: 11 },
    { day: 'Saturday', learning: 0, projects: 5.5, networking: 1.5, content: 2, total: 9 },
    { day: 'Sunday', learning: 0, projects: 0, networking: 0, content: 0, total: 0 },
  ];
  
  const totalByCategory = weeklyHourTracking.reduce(
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
  
  const targetHours = {
    learning: 25,
    projects: 12.5,
    networking: 7.5,
    content: 5,
    total: 50
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-lg font-bold mb-4">Weekly Hour Tracking</h3>
      
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
                <td key={idx} className="py-2 px-3 text-sm">{day.learning}</td>
              ))}
              <td className="py-2 px-3 text-sm font-bold">{totalByCategory.learning}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-sm font-medium">Projects</td>
              <td className="py-2 px-3 text-sm">{targetHours.projects}</td>
              {weeklyHourTracking.map((day, idx) => (
                <td key={idx} className="py-2 px-3 text-sm">{day.projects}</td>
              ))}
              <td className="py-2 px-3 text-sm font-bold">{totalByCategory.projects}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-sm font-medium">Networking</td>
              <td className="py-2 px-3 text-sm">{targetHours.networking}</td>
              {weeklyHourTracking.map((day, idx) => (
                <td key={idx} className="py-2 px-3 text-sm">{day.networking}</td>
              ))}
              <td className="py-2 px-3 text-sm font-bold">{totalByCategory.networking}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-sm font-medium">Content Creation</td>
              <td className="py-2 px-3 text-sm">{targetHours.content}</td>
              {weeklyHourTracking.map((day, idx) => (
                <td key={idx} className="py-2 px-3 text-sm">{day.content}</td>
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