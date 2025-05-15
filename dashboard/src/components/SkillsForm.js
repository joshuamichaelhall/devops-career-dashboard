import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';

const SkillsForm = ({ category, onClose }) => {
  const { dashboardData, refreshData } = useDashboard();
  const [skillName, setSkillName] = useState('');
  const [proficiency, setProficiency] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  
  // Find the existing category
  const categoryData = dashboardData?.skills?.find(c => c.category === category);
  const initialProficiency = categoryData?.proficiency || 'Not Started';
  
  // Set initial proficiency when component mounts
  useEffect(() => {
    setProficiency(initialProficiency);
  }, [initialProficiency]);
  
  const proficiencyLevels = [
    'Not Started',
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert'
  ];
  
  // Handle skill selection for removal or editing
  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill);
    setSkillName(skill); // Pre-fill the form with selected skill
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    
    if (!skillName.trim()) {
      setError('Skill name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Find the category index
      const categoryIndex = dashboardData.skills.findIndex(c => c.category === category);
      
      if (categoryIndex === -1) {
        setError(`Category "${category}" not found`);
        return;
      }
      
      // Update skills data
      const updatedSkills = [...dashboardData.skills];
      
      // Add the new skill if it doesn't exist
      if (!updatedSkills[categoryIndex].skills.includes(skillName)) {
        updatedSkills[categoryIndex].skills.push(skillName);
      }
      
      // Update proficiency if changed
      if (proficiency !== updatedSkills[categoryIndex].proficiency) {
        updatedSkills[categoryIndex].proficiency = proficiency;
      }
      
      // Update backend via API
      const response = await fetch('http://localhost:3001/api/data/skills', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSkills),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update skills');
      }
      
      // Clear form
      setSkillName('');
      setSelectedSkill('');
      
      // Refresh data to update UI
      await refreshData();
      
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Error updating skills:', err);
      setError('Failed to update skills. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRemoveSkill = async () => {
    if (!selectedSkill) {
      setError('Please select a skill to remove');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Find the category index
      const categoryIndex = dashboardData.skills.findIndex(c => c.category === category);
      
      if (categoryIndex === -1) {
        setError(`Category "${category}" not found`);
        return;
      }
      
      // Update skills data
      const updatedSkills = [...dashboardData.skills];
      
      // Remove the selected skill
      updatedSkills[categoryIndex].skills = updatedSkills[categoryIndex].skills.filter(
        skill => skill !== selectedSkill
      );
      
      // Update backend via API
      const response = await fetch('http://localhost:3001/api/data/skills', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSkills),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update skills');
      }
      
      // Clear form
      setSkillName('');
      setSelectedSkill('');
      
      // Refresh data to update UI
      await refreshData();
      
    } catch (err) {
      console.error('Error removing skill:', err);
      setError('Failed to remove skill. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-bold mb-2">Update Skills: {category}</h3>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleAddSkill}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add/Edit Skill
          </label>
          <input
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter skill name"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proficiency Level
          </label>
          <select
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          >
            {proficiencyLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
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
            {isSubmitting ? 'Saving...' : (selectedSkill ? 'Update Skill' : 'Add Skill')}
          </button>
          
          {selectedSkill && (
            <button
              type="button"
              onClick={handleRemoveSkill}
              className="ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Removing...' : 'Remove Skill'}
            </button>
          )}
        </div>
      </form>
      
      <div className="mt-4">
        <h4 className="font-medium text-sm mb-2">Current Skills:</h4>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {categoryData?.skills?.map((skill, index) => (
            <li 
              key={index} 
              className={`cursor-pointer hover:text-blue-600 ${selectedSkill === skill ? 'text-blue-600 font-medium' : ''}`}
              onClick={() => handleSkillSelect(skill)}
            >
              {skill}
            </li>
          ))}
          {(!categoryData?.skills || categoryData.skills.length === 0) && (
            <li className="text-gray-500 italic">No skills yet</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SkillsForm;