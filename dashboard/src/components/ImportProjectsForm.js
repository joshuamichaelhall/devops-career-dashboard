import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { getSuggestedProjects, getAllProjects } from '../data/templates/projects-template';

const ImportProjectsForm = ({ onClose }) => {
  const { dashboardData, refreshData } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [track, setTrack] = useState('aws');
  const [difficulty, setDifficulty] = useState('all');
  const [selectedProjects, setSelectedProjects] = useState([]);
  
  // Define options
  const trackOptions = [
    { id: 'aws', name: 'AWS/Cloud' },
    { id: 'kubernetes', name: 'Kubernetes/Containers' },
    { id: 'devops', name: 'General DevOps' }
  ];
  
  const difficultyOptions = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];
  
  // Get suggested projects based on selected criteria
  const suggestedProjects = getSuggestedProjects(track, difficulty);
  
  // Generate target date 3 months from now
  const getDefaultTargetDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    return date.toISOString().split('T')[0];
  };
  
  // Toggle project selection
  const toggleProjectSelection = (projectName) => {
    if (selectedProjects.includes(projectName)) {
      setSelectedProjects(selectedProjects.filter(name => name !== projectName));
    } else {
      setSelectedProjects([...selectedProjects, projectName]);
    }
  };
  
  // Handle form submission
  const handleImport = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      if (selectedProjects.length === 0) {
        setError('Please select at least one project to import');
        return;
      }
      
      // Filter selected projects from suggested projects
      const projectsToImport = suggestedProjects
        .filter(project => selectedProjects.includes(project.name))
        .map(project => ({
          ...project,
          targetDate: getDefaultTargetDate()
        }));
      
      // Combine with existing projects
      const existingProjects = dashboardData.projects || [];
      const existingProjectNames = existingProjects.map(p => p.name);
      
      // Filter out any projects that already exist (by name)
      const newProjects = projectsToImport.filter(
        project => !existingProjectNames.includes(project.name)
      );
      
      if (newProjects.length === 0) {
        setError('All selected projects already exist in your dashboard');
        setLoading(false);
        return;
      }
      
      // Combine existing and new projects
      const updatedProjects = [...existingProjects, ...newProjects];
      
      // Update projects in the backend
      const response = await fetch('http://localhost:3001/api/data/projects', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProjects),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update projects');
      }
      
      setSuccess(`Successfully imported ${newProjects.length} projects`);
      
      // Refresh data to update UI
      await refreshData();
      
      // Close form after success (optional)
      if (onClose && newProjects.length > 0) {
        setTimeout(() => onClose(), 1500);
      }
    } catch (err) {
      console.error('Error importing projects:', err);
      setError('Failed to import projects. Check console for details.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-bold mb-4">Import Suggested Projects</h3>
      
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
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Technology Track
          </label>
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            {trackOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            {difficultyOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Projects to Import
        </label>
        <div className="space-y-3 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded">
          {suggestedProjects.length > 0 ? (
            suggestedProjects.map(project => (
              <div 
                key={project.name}
                className={`p-3 border rounded cursor-pointer ${
                  selectedProjects.includes(project.name) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => toggleProjectSelection(project.name)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{project.name}</span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    project.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    project.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {project.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.technologies.slice(0, 4).map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{project.technologies.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No projects available for the selected criteria</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span className="mr-2">{selectedProjects.length} of {suggestedProjects.length} selected</span>
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
          disabled={loading || selectedProjects.length === 0}
        >
          {loading ? 'Importing...' : 'Import Selected Projects'}
        </button>
      </div>
    </div>
  );
};

export default ImportProjectsForm;