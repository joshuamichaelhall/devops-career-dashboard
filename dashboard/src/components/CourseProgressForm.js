import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

const CourseProgressForm = ({ onClose }) => {
  const { dashboardData, refreshData } = useDashboard();
  const [courseName, setCourseName] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [progress, setProgress] = useState(0);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Current courses with their progress (hardcoded for now)
  const courses = [
    { name: "Adrian Cantrill's AWS SAA", progress: 10 },
    { name: "How Linux Works", progress: 15 },
    { name: "The Linux Command Line", progress: 5 }
  ];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const selectedCourse = isAddingCourse ? newCourseName : courseName;
    
    if (!selectedCourse) {
      setError('Course name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // For demonstration, we'll just simulate an API call
      // In a real implementation, you would add this to your backend API
      
      // Update learning data - normally you'd fetch this from API 
      // and make updates through context functions similar to skills
      
      // For now, just update the UI temporarily
      alert(`Updated progress for ${selectedCourse} to ${progress}%`);
      
      // Call API (not implemented in this demo) 
      // For a full implementation, add updateCourseProgress to context
      /*
      await fetch('http://localhost:3001/api/courses/progress', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName: selectedCourse,
          progress: progress
        }),
      });
      */
      
      // Refresh data
      // await refreshData();
      
      // Reset form
      setCourseName('');
      setNewCourseName('');
      setProgress(0);
      
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Error updating course progress:', err);
      setError('Failed to update course progress. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCourseSelect = (e) => {
    const selected = e.target.value;
    setCourseName(selected);
    
    // Set initial progress from existing course data
    if (selected) {
      const course = courses.find(c => c.name === selected);
      if (course) {
        setProgress(course.progress);
      }
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-bold mb-2">Update Course Progress</h3>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <input
              type="checkbox"
              checked={isAddingCourse}
              onChange={(e) => setIsAddingCourse(e.target.checked)}
              className="mr-2"
            />
            Add New Course
          </label>
          
          {isAddingCourse ? (
            <input
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter new course name"
              disabled={isSubmitting}
            />
          ) : (
            <select
              value={courseName}
              onChange={handleCourseSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.name} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Progress: {progress}%
          </label>
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
            <span>50%</span>
            <span>100%</span>
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
            {isSubmitting ? 'Updating...' : 'Update Progress'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseProgressForm;