import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchDashboardData, 
  updateTaskStatus, 
  logTime, 
  updateDashboardSection,
  addLearningResource as apiAddLearningResource,
  updateLearningResource as apiUpdateLearningResource
} from '../services/api';
// Import local data dynamically to avoid issues with relative paths
const dashboardData = require('../data/data.json');

// Create context
const DashboardContext = createContext();

// Hook to use the dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// Provider component
export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Try to fetch from API first
        try {
          const data = await fetchDashboardData();
          setDashboardData(data);
          setError(null);
        } catch (apiErr) {
          // If API fails, use local data as fallback
          console.warn('API fetch failed, using local data:', apiErr);
          setDashboardData(dashboardData);
          setError(null);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Complete a task
  const completeTask = async (taskId, isCompleted) => {
    try {
      setLoading(true);
      const result = await updateTaskStatus(taskId, isCompleted);
      
      // Update local state
      setDashboardData(prevData => {
        const updatedGoals = prevData.goals.map(goal => 
          goal.content === taskId ? { ...goal, completed: isCompleted } : goal
        );
        
        return {
          ...prevData,
          goals: updatedGoals,
          overview: {
            ...prevData.overview,
            completedGoals: isCompleted 
              ? prevData.overview.completedGoals + 1 
              : prevData.overview.completedGoals - 1,
            goalCompletionRate: Math.round(
              (isCompleted 
                ? prevData.overview.completedGoals + 1 
                : prevData.overview.completedGoals - 1) * 100 / prevData.overview.totalGoals
            )
          }
        };
      });
      
      return result;
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async (taskContent, category, dueDate) => {
    try {
      setLoading(true);
      
      // Create the new task object
      const newTask = {
        content: taskContent,
        category,
        dueDate,
        completed: false
      };
      
      // Update local state first
      const updatedGoals = [...dashboardData.goals, newTask];
      
      // Update the goals section
      const result = await updateDashboardSection('goals', updatedGoals);
      
      // Also update the overview section for total goals
      await updateDashboardSection('overview', {
        ...dashboardData.overview,
        totalGoals: dashboardData.overview.totalGoals + 1,
        goalCompletionRate: Math.round(
          dashboardData.overview.completedGoals * 100 / (dashboardData.overview.totalGoals + 1)
        )
      });
      
      // Update local state with the backend response
      setDashboardData(prevData => ({
        ...prevData,
        goals: updatedGoals,
        overview: {
          ...prevData.overview,
          totalGoals: prevData.overview.totalGoals + 1,
          goalCompletionRate: Math.round(
            prevData.overview.completedGoals * 100 / (prevData.overview.totalGoals + 1)
          )
        }
      }));
      
      return result;
    } catch (err) {
      setError('Failed to add task');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Log time for a category
  const logTimeEntry = async (category, hours, date) => {
    try {
      setLoading(true);
      const result = await logTime(category, hours, date);
      
      // Update local state
      setDashboardData(prevData => {
        const categoryKey = `${category.toLowerCase()}Hours`;
        
        return {
          ...prevData,
          weeklyMetrics: {
            ...prevData.weeklyMetrics,
            [categoryKey]: prevData.weeklyMetrics[categoryKey] + parseInt(hours),
            totalHours: prevData.weeklyMetrics.totalHours + parseInt(hours)
          }
        };
      });
      
      return result;
    } catch (err) {
      setError('Failed to log time');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update project progress
  const updateProjectProgress = async (projectName, progress) => {
    try {
      setLoading(true);
      
      // Update local state first
      const updatedProjects = dashboardData.projects.map(project => 
        project.name === projectName ? { ...project, progress } : project
      );
      
      // Update backend
      const result = await updateDashboardSection('projects', updatedProjects);
      
      // Update local state with backend response
      setDashboardData(prevData => ({
        ...prevData,
        projects: updatedProjects
      }));
      
      return result;
    } catch (err) {
      setError('Failed to update project progress');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update certification progress
  const updateCertificationProgress = async (certName, progress, status) => {
    try {
      setLoading(true);
      
      // Update local state first
      const updatedCertifications = dashboardData.certifications.map(cert => 
        cert.name === certName ? { ...cert, progress, status } : cert
      );
      
      // Update backend
      const result = await updateDashboardSection('certifications', updatedCertifications);
      
      // Update local state with backend response
      setDashboardData(prevData => ({
        ...prevData,
        certifications: updatedCertifications
      }));
      
      return result;
    } catch (err) {
      setError('Failed to update certification progress');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update skills list
  const updateSkills = async (categoryName, newSkill, proficiency) => {
    try {
      setLoading(true);
      
      // Find the category
      const categoryIndex = dashboardData.skills.findIndex(c => c.category === categoryName);
      
      if (categoryIndex === -1) {
        setError(`Category "${categoryName}" not found`);
        return;
      }
      
      // Update skills array
      const updatedSkills = [...dashboardData.skills];
      
      // Add the skill if it doesn't exist
      if (newSkill && !updatedSkills[categoryIndex].skills.includes(newSkill)) {
        updatedSkills[categoryIndex].skills.push(newSkill);
      }
      
      // Update proficiency if provided
      if (proficiency) {
        updatedSkills[categoryIndex].proficiency = proficiency;
      }
      
      // Update backend
      const result = await updateDashboardSection('skills', updatedSkills);
      
      // Update local state
      setDashboardData(prevData => ({
        ...prevData,
        skills: updatedSkills
      }));
      
      return result;
    } catch (err) {
      setError('Failed to update skills');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Add a learning resource
  const addLearningResource = async (resourceData) => {
    try {
      setLoading(true);
      
      // Try to add via API
      try {
        const result = await apiAddLearningResource(resourceData);
        
        // Update local state
        setDashboardData(prevData => ({
          ...prevData,
          learningResources: [...(prevData.learningResources || []), result.resource]
        }));
        
        return result;
      } catch (apiErr) {
        console.warn('API failed, updating local state only:', apiErr);
        
        // Fallback: Update local state only
        const newResource = {
          id: Date.now().toString(),
          ...resourceData,
          progress: 0,
          dateAdded: new Date().toISOString().split('T')[0]
        };
        
        setDashboardData(prevData => ({
          ...prevData,
          learningResources: [...(prevData.learningResources || []), newResource]
        }));
        
        return { success: true, resource: newResource };
      }
    } catch (err) {
      setError('Failed to add learning resource');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update a learning resource
  const updateLearningResource = async (id, updates) => {
    try {
      setLoading(true);
      
      // Try to update via API
      try {
        const result = await apiUpdateLearningResource(id, updates);
        
        // Update local state
        setDashboardData(prevData => {
          const updatedResources = prevData.learningResources.map(resource => 
            resource.id === id ? { ...resource, ...updates } : resource
          );
          
          return {
            ...prevData,
            learningResources: updatedResources
          };
        });
        
        return result;
      } catch (apiErr) {
        console.warn('API failed, updating local state only:', apiErr);
        
        // Fallback: Update local state only
        setDashboardData(prevData => {
          const updatedResources = prevData.learningResources.map(resource => 
            resource.id === id ? { ...resource, ...updates } : resource
          );
          
          return {
            ...prevData,
            learningResources: updatedResources
          };
        });
        
        return { success: true };
      }
    } catch (err) {
      setError('Failed to update learning resource');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update career roadmap configuration
  const updateRoadmapConfig = async (roadmapType, phases, title, description) => {
    try {
      setLoading(true);
      
      // Update careerPhases in backend
      const phasesResult = await updateDashboardSection('careerPhases', phases);
      
      // Update overview to include roadmap title and description
      const updatedOverview = {
        ...dashboardData.overview,
        roadmapTitle: title,
        roadmapDescription: description
      };
      
      const overviewResult = await updateDashboardSection('overview', updatedOverview);
      
      // Update local state
      setDashboardData(prevData => ({
        ...prevData,
        careerPhases: phases,
        overview: {
          ...prevData.overview,
          roadmapTitle: title,
          roadmapDescription: description
        }
      }));
      
      return { success: true, phasesResult, overviewResult };
    } catch (err) {
      setError('Failed to update roadmap configuration');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    dashboardData,
    loading,
    error,
    completeTask,
    addTask,
    logTimeEntry,
    updateProjectProgress,
    updateCertificationProgress,
    updateSkills,
    addLearningResource,
    updateLearningResource,
    updateRoadmapConfig,
    refreshData: async () => {
      try {
        setLoading(true);
        setError(null);
        
        try {
          // Clear both localStorage and sessionStorage caches
          localStorage.removeItem('dashboard_data_cache');
          sessionStorage.removeItem('dashboard_data_cache');
          
          // Clear any application cache
          if ('caches' in window) {
            try {
              const cacheKeys = await caches.keys();
              await Promise.all(
                cacheKeys.filter(key => key.includes('dashboard')).map(key => caches.delete(key))
              );
            } catch (cacheErr) {
              console.warn('Failed to clear application cache:', cacheErr);
            }
          }
          
          // Try to fetch fresh data from API
          console.log('Attempting to fetch fresh dashboard data...');
          const data = await fetchDashboardData({ nocache: Date.now() });
          
          if (!data) {
            throw new Error('Received empty data from API');
          }
          
          console.log('Successfully loaded dashboard data');
          setDashboardData(data);
          
          // Force reload the page to clear any component-level cached state
          window.location.reload();
        } catch (apiErr) {
          console.warn('API refresh failed:', apiErr);
          
          // Force browser reload 
          window.location.reload();
        }
      } catch (err) {
        console.error('Critical error during refresh:', err);
        setError('Failed to refresh dashboard data: ' + (err.message || 'Unknown error'));
        // Still attempt to reload the page
        window.location.reload();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};