import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { getAllSkills, getBeginnerSkills, getTrackSpecificSkills } from '../data/templates/skills-template';

const ImportSkillsForm = ({ onClose }) => {
  const { refreshData } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [importOption, setImportOption] = useState('all');
  const [track, setTrack] = useState('aws');
  const [careerStage, setCareerStage] = useState('early');
  
  // Define options
  const trackOptions = [
    { id: 'aws', name: 'AWS/Cloud Specialist' },
    { id: 'kubernetes', name: 'Kubernetes/Container Specialist' },
    { id: 'devops', name: 'General DevOps Engineer' }
  ];
  
  const careerStageOptions = [
    { id: 'early', name: 'Early Career (0-2 years)' },
    { id: 'mid', name: 'Mid Career (2-5 years)' },
    { id: 'senior', name: 'Senior Career (5+ years)' }
  ];
  
  const handleImport = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Determine which skills to import
      let skillsToImport;
      
      switch (importOption) {
        case 'all':
          skillsToImport = getAllSkills();
          break;
        case 'beginner':
          skillsToImport = getBeginnerSkills(careerStage);
          break;
        case 'track':
          skillsToImport = getTrackSpecificSkills(track);
          break;
        default:
          skillsToImport = getAllSkills();
      }
      
      // Update skills in the backend
      try {
        // Update the skills section via the dashboard API
        const response = await fetch('http://localhost:3001/api/data/skills', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(skillsToImport),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update skills');
        }
        
        setSuccess(`Successfully imported ${skillsToImport.length} skill categories`);
        
        // Refresh data
        await refreshData();
      } catch (err) {
        console.error('Error importing skills:', err);
        setError('Failed to import skills. Check console for details.');
      }
    } catch (err) {
      console.error('Error in import process:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold mb-4">Import Skills</h3>
      
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Import Option
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="importOption"
              value="all"
              checked={importOption === 'all'}
              onChange={() => setImportOption('all')}
              className="mr-2"
            />
            <span>All Skills (Complete DevOps Skillset)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="importOption"
              value="beginner"
              checked={importOption === 'beginner'}
              onChange={() => setImportOption('beginner')}
              className="mr-2"
            />
            <span>Beginner Skills by Career Stage</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="importOption"
              value="track"
              checked={importOption === 'track'}
              onChange={() => setImportOption('track')}
              className="mr-2"
            />
            <span>Skills by Specialty Track</span>
          </label>
        </div>
      </div>
      
      {importOption === 'beginner' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Career Stage
          </label>
          <select
            value={careerStage}
            onChange={(e) => setCareerStage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {careerStageOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {importOption === 'track' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specialty Track
          </label>
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {trackOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500 mb-4">
        <strong>Note:</strong> This will overwrite your existing skills list with the selected template.
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
          disabled={loading}
        >
          {loading ? 'Importing...' : 'Import Skills'}
        </button>
      </div>
    </div>
  );
};

export default ImportSkillsForm;