import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

const AddSkillForm = ({ onClose }) => {
  const { dashboardData, updateSkills } = useDashboard();
  const [categoryName, setCategoryName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [skillName, setSkillName] = useState('');
  const [proficiency, setProficiency] = useState('Beginner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  
  // Get existing categories
  const categories = dashboardData?.skills?.map(c => c.category) || [];
  
  const proficiencyLevels = [
    'Not Started',
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert'
  ];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Determine which category to use
    const finalCategory = isAddingCategory ? newCategory : categoryName;
    
    if (!finalCategory) {
      setError('Category is required');
      return;
    }
    
    if (!skillName.trim()) {
      setError('Skill name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      if (isAddingCategory) {
        // Create new category first
        const updatedSkills = [...dashboardData.skills, {
          category: newCategory,
          skills: [skillName],
          proficiency
        }];
        
        // Update via API
        await fetch('http://localhost:3001/api/data/skills', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedSkills),
        });
      } else {
        // Add to existing category
        await updateSkills(categoryName, skillName, proficiency);
      }
      
      // Reset form and close
      setSkillName('');
      setNewCategory('');
      setProficiency('Beginner');
      
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Error adding skill:', err);
      setError('Failed to add skill. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold mb-4">Add New Skill</h3>
      
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
              checked={isAddingCategory}
              onChange={(e) => setIsAddingCategory(e.target.checked)}
              className="mr-2"
            />
            Add New Category
          </label>
          
          {isAddingCategory ? (
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter new category name"
              disabled={isSubmitting}
            />
          ) : (
            <select
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skill Name
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
            {isSubmitting ? 'Adding...' : 'Add Skill'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSkillForm;