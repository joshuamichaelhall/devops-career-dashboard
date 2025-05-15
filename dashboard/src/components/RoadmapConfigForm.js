import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  getRoadmapTemplate, 
  getRoadmapPhases, 
  createCustomRoadmap 
} from '../data/templates/roadmap-template';

const RoadmapConfigForm = ({ onClose }) => {
  const { dashboardData, refreshData, updateRoadmapConfig } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [roadmapType, setRoadmapType] = useState('devops');
  const [customTracks, setCustomTracks] = useState([]);
  const [customTitle, setCustomTitle] = useState('');
  const [roadmapPhases, setRoadmapPhases] = useState([]);
  const [currentView, setCurrentView] = useState('select'); // select, customize, review
  
  // Roadmap type options
  const roadmapOptions = [
    { id: 'aws', name: 'AWS/Cloud Specialist', description: 'Focus on AWS cloud services and architecture' },
    { id: 'kubernetes', name: 'Kubernetes Specialist', description: 'Focus on container orchestration and platform engineering' },
    { id: 'devops', name: 'DevOps Engineer', description: 'Balanced focus across the full DevOps toolchain' },
    { id: 'sre', name: 'Site Reliability Engineer', description: 'Focus on reliability, monitoring, and operations' },
    { id: 'platform', name: 'Platform Engineer', description: 'Focus on building developer platforms and platform engineering' },
    { id: 'devsecops', name: 'DevSecOps Specialist', description: 'Focus on security automation and DevSecOps practices' },
    { id: 'custom', name: 'Custom Roadmap', description: 'Create a blend of multiple specializations' }
  ];
  
  // Track options for custom roadmap
  const trackOptions = [
    { id: 'aws', name: 'AWS/Cloud', description: 'Cloud architecture and AWS services' },
    { id: 'kubernetes', name: 'Kubernetes', description: 'Container orchestration and Kubernetes ecosystem' },
    { id: 'devops', name: 'DevOps', description: 'Core DevOps practices and tooling' },
    { id: 'sre', name: 'SRE', description: 'Reliability engineering and observability' },
    { id: 'platform', name: 'Platform', description: 'Platform engineering and developer experience' },
    { id: 'devsecops', name: 'DevSecOps', description: 'Security automation and DevSecOps practices' }
  ];
  
  // Load roadmap phases when type changes
  useEffect(() => {
    if (roadmapType === 'custom') {
      if (customTracks.length > 0) {
        const customRoadmap = createCustomRoadmap(customTracks);
        setRoadmapPhases(customRoadmap.phases);
        if (!customTitle) {
          setCustomTitle(customRoadmap.title);
        }
      }
    } else {
      const template = getRoadmapTemplate(roadmapType);
      setRoadmapPhases(template.phases);
    }
  }, [roadmapType, customTracks]);
  
  // Toggle track selection for custom roadmap
  const toggleTrackSelection = (trackId) => {
    if (customTracks.includes(trackId)) {
      setCustomTracks(customTracks.filter(id => id !== trackId));
    } else {
      setCustomTracks([...customTracks, trackId]);
    }
  };
  
  // Update phase progress
  const updatePhaseProgress = (phaseId, progress) => {
    const updatedPhases = roadmapPhases.map(phase => {
      if (phase.id === phaseId) {
        return { ...phase, progress: parseInt(progress) };
      }
      return phase;
    });
    setRoadmapPhases(updatedPhases);
  };
  
  // Format dates for display
  const formatDate = (months) => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setMonth(today.getMonth() + months);
    return futureDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };
  
  // Handle form submission
  const handleSaveRoadmap = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Create the roadmap data structure
      let roadmapTitle, roadmapDescription;
      
      if (roadmapType === 'custom') {
        roadmapTitle = customTitle || 'Custom Career Roadmap';
        roadmapDescription = `Custom roadmap blending ${customTracks.join(', ')} specializations`;
      } else {
        const template = getRoadmapTemplate(roadmapType);
        roadmapTitle = template.title;
        roadmapDescription = template.description;
      }
      
      // Use the context function to update roadmap configuration
      try {
        await updateRoadmapConfig(
          roadmapType,
          roadmapPhases,
          roadmapTitle,
          roadmapDescription
        );
        
        setSuccess('Career roadmap updated successfully!');
        
        // Refresh data
        await refreshData();
        
        // Close form after success
        if (onClose) {
          setTimeout(() => onClose(), 1500);
        }
      } catch (err) {
        console.error('Error updating roadmap:', err);
        setError('Failed to update roadmap. Check console for details.');
      }
    } catch (err) {
      console.error('Error in roadmap update process:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Render the roadmap type selection view
  const renderSelectView = () => (
    <>
      <h3 className="text-lg font-bold mb-4">Select Career Roadmap</h3>
      
      <div className="mb-4">
        <div className="space-y-3">
          {roadmapOptions.map(option => (
            <label
              key={option.id}
              className={`flex items-start p-3 border rounded cursor-pointer ${
                roadmapType === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="roadmapType"
                value={option.id}
                checked={roadmapType === option.id}
                onChange={() => setRoadmapType(option.id)}
                className="mt-1 mr-2"
              />
              <div>
                <div className="font-medium">{option.name}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      {roadmapType === 'custom' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Tracks to Include
          </label>
          <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm text-blue-800 mb-4">
            <p>Select multiple tracks to create a custom blended roadmap. The first track you select will be the primary focus, with others incorporated as specializations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trackOptions.map(track => (
              <label 
                key={track.id}
                className={`flex flex-col p-3 border rounded cursor-pointer transition-all ${
                  customTracks.includes(track.id) 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={customTracks.includes(track.id)}
                    onChange={() => toggleTrackSelection(track.id)}
                    className="mt-1 mr-2"
                  />
                  <div>
                    <span className="font-medium">
                      {track.name}
                      {customTracks[0] === track.id && customTracks.length > 1 && (
                        <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">Primary</span>
                      )}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{track.description}</p>
                  </div>
                </div>
                {customTracks.includes(track.id) && customTracks.length > 1 && customTracks[0] !== track.id && (
                  <div className="mt-2 text-xs text-right">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        // Move this track to be primary (first in the array)
                        const newTracks = [
                          track.id,
                          ...customTracks.filter(id => id !== track.id)
                        ];
                        setCustomTracks(newTracks);
                      }}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Make Primary
                    </button>
                  </div>
                )}
              </label>
            ))}
          </div>
          {customTracks.length === 0 && (
            <div className="text-sm text-red-600 mt-2">
              Please select at least one track for a custom roadmap.
            </div>
          )}
          {customTracks.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
              <p className="font-medium">Selected tracks (in priority order):</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {customTracks.map((trackId, index) => {
                  const track = trackOptions.find(t => t.id === trackId);
                  return (
                    <div key={trackId} className="bg-white border border-gray-200 rounded px-2 py-1 flex items-center">
                      <span>{index + 1}. {track?.name}</span>
                      <button
                        onClick={() => toggleTrackSelection(trackId)}
                        className="ml-2 text-gray-400 hover:text-red-600"
                      >
                        &times;
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        
        <button
          onClick={() => setCurrentView('customize')}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={roadmapType === 'custom' && customTracks.length === 0}
        >
          Continue
        </button>
      </div>
    </>
  );
  
  // Render the customize roadmap phases view
  const renderCustomizeView = () => (
    <>
      <h3 className="text-lg font-bold mb-4">
        Customize Roadmap Phases
      </h3>
      
      {roadmapType === 'custom' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Roadmap Title
          </label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter custom roadmap title"
          />
        </div>
      )}
      
      <div className="mb-4">
        <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm text-blue-800 mb-4">
          <p>Adjust progress for each phase to reflect your current career status.</p>
        </div>
        
        <div className="space-y-4">
          {roadmapPhases.map((phase, index) => (
            <div key={phase.id} className="border rounded p-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Phase {index + 1}: {phase.name}</h4>
                <span className="text-sm text-gray-500">{phase.duration}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
              
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Progress: {phase.progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={phase.progress}
                onChange={(e) => updatePhaseProgress(phase.id, e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              
              <div className="mt-2">
                <h5 className="text-sm font-medium text-gray-700">Key Milestones:</h5>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                  {phase.milestones.map((milestone, i) => (
                    <li key={i}>{milestone}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between space-x-2">
        <button
          onClick={() => setCurrentView('select')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back
        </button>
        
        <button
          onClick={() => setCurrentView('review')}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Review & Save
        </button>
      </div>
    </>
  );
  
  // Render the review roadmap view
  const renderReviewView = () => (
    <>
      <h3 className="text-lg font-bold mb-4">
        Review Career Roadmap
      </h3>
      
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
        <h4 className="font-medium text-lg mb-2">
          {roadmapType === 'custom' ? customTitle : getRoadmapTemplate(roadmapType).title}
        </h4>
        <p className="text-gray-600 mb-4">
          {roadmapType === 'custom' 
            ? `Custom roadmap blending ${customTracks.map(id => trackOptions.find(t => t.id === id)?.name).join(', ')} specializations` 
            : getRoadmapTemplate(roadmapType).description}
        </p>
        
        <div className="bg-gray-50 p-4 rounded">
          <div className="mb-4">
            <h5 className="font-medium mb-2">Career Progression Timeline:</h5>
            <div className="w-full bg-gray-200 rounded-full h-5">
              <div className="flex">
                {roadmapPhases.map((phase, index) => {
                  // Calculate color based on progress - more saturated as progress increases
                  const baseColor = index % 2 === 0 ? 'rgba(37, 99, 235, ' : 'rgba(67, 119, 235, ';
                  const opacity = phase.progress > 0 ? 0.3 + (phase.progress / 150) : 0.1;
                  
                  return (
                    <div 
                      key={phase.id}
                      className={`h-5 flex items-center justify-center text-xs font-medium text-blue-900 ${index === 0 ? 'rounded-l-full' : ''} ${index === roadmapPhases.length - 1 ? 'rounded-r-full' : ''}`}
                      style={{ 
                        width: `${100 / roadmapPhases.length}%`,
                        backgroundColor: `${baseColor}${opacity})`,
                        border: '1px solid rgba(37, 99, 235, 0.5)'
                      }}
                    >
                      {phase.progress > 0 ? `${phase.progress}%` : ''}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Start</span>
              <span>Approx. {formatDate(9)} (9 months)</span>
              <span>Approx. {formatDate(18)} (18 months)</span>
              <span>Mastery</span>
            </div>
          </div>

          <div className="mb-5">
            <h5 className="font-medium mb-3">Your Roadmap Summary:</h5>
            <div className="flex items-center mb-2">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">Starts with <span className="font-medium">{roadmapPhases[0]?.name}</span></span>
            </div>
            <div className="flex items-center mb-2">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Builds to <span className="font-medium">{roadmapPhases[1]?.name}</span></span>
            </div>
            <div className="flex items-center mb-2">
              <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-sm">Advances through <span className="font-medium">{roadmapPhases[2]?.name}</span></span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm">Culminates with <span className="font-medium">{roadmapPhases[3]?.name}</span></span>
            </div>
          </div>
          
          <div className="mb-3">
            <h5 className="font-medium mb-2">Phase Progression:</h5>
            {roadmapPhases.map((phase, index) => (
              <div key={phase.id} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <div className={`p-3 ${
                  index === 0 ? 'bg-blue-50 border-b border-blue-100' :
                  index === 1 ? 'bg-green-50 border-b border-green-100' :
                  index === 2 ? 'bg-purple-50 border-b border-purple-100' :
                  'bg-yellow-50 border-b border-yellow-100'
                }`}>
                  <div className="flex justify-between items-center">
                    <h6 className="font-medium">{phase.name}</h6>
                    <span className="text-sm text-gray-600">{phase.duration}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{phase.description}</p>
                </div>
                
                <div className="px-3 py-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current Progress:</span>
                    <span className="font-medium">{phase.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                    <div 
                      className={`h-2.5 rounded-full ${
                        index === 0 ? 'bg-blue-600' :
                        index === 1 ? 'bg-green-600' :
                        index === 2 ? 'bg-purple-600' :
                        'bg-yellow-600'
                      }`}
                      style={{ width: `${phase.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="mt-2">
                    <h6 className="text-sm font-medium mb-1">Key Milestones:</h6>
                    <ul className="space-y-1">
                      {phase.milestones.map((milestone, i) => (
                        <li key={i} className="text-sm flex items-start">
                          <span className="mr-2 text-gray-400">•</span>
                          <span>{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between space-x-2">
        <button
          onClick={() => setCurrentView('customize')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          Back
        </button>
        
        <button
          onClick={handleSaveRoadmap}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Roadmap'}
        </button>
      </div>
    </>
  );
  
  // Render appropriate view based on current state
  const renderCurrentView = () => {
    switch (currentView) {
      case 'select':
        return renderSelectView();
      case 'customize':
        return renderCustomizeView();
      case 'review':
        return renderReviewView();
      default:
        return renderSelectView();
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {renderCurrentView()}
    </div>
  );
};

export default RoadmapConfigForm;