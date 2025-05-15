import React, { useState, useEffect } from 'react';
import { Calendar, Clock, BarChart2, Users, Book, Briefcase, Award, CheckSquare, RefreshCw, Plus } from 'lucide-react';
import { useDashboard } from './context/DashboardContext';
import { useDemoMode } from './components/DemoMode';
import DemoHeader from './components/DemoHeader';
import TasksTracker from './components/TasksTracker';
import WeeklyMetricsCard from './components/WeeklyMetricsCard';
import ProgressUpdater from './components/ProgressUpdater';
import WeeklyScheduleStats from './components/WeeklyScheduleStats';
import SkillsForm from './components/SkillsForm';
import AddSkillForm from './components/AddSkillForm';
import ImportSkillsForm from './components/ImportSkillsForm';
import ImportProjectsForm from './components/ImportProjectsForm';
import ImportResourcesForm from './components/ImportResourcesForm';
import ImportScheduleForm from './components/ImportScheduleForm';
import RoadmapConfigForm from './components/RoadmapConfigForm';
import CourseProgressForm from './components/CourseProgressForm';
import AddResourceForm from './components/AddResourceForm';
import ResourceProgressForm from './components/ResourceProgressForm';
import ClayConnectForm from './components/ClayConnectForm';
import { fetchNetworkingMetrics, fetchActivities, getUpcomingFollowUps } from './services/clayApi';

// Main Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { dashboardData, loading, error, refreshData } = useDashboard();
  const { isDemoMode } = useDemoMode();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error || 'Failed to load dashboard data'}</p>
          <button 
            onClick={refreshData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Load data from the context with safety checks
  const careerPhases = dashboardData?.careerPhases || [];
  const upcomingCertifications = dashboardData?.certifications || [];
  const weeklyMetrics = dashboardData?.weeklyMetrics || {};
  const currentProjects = dashboardData?.projects || [];
  const roadmapTitle = dashboardData?.overview?.roadmapTitle;
  const skills = dashboardData?.skills || [];
  
  // Render the active tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OverviewCard careerPhases={careerPhases} />
            <WeeklyMetricsCard />
            <UpcomingGoalsCard />
            <CertificationProgressCard certifications={upcomingCertifications} />
          </div>
        );
      case 'skills':
        return <SkillsTracker skills={skills} />;
      case 'projects':
        return <ProjectsTracker projects={currentProjects} />;
      case 'networking':
        return <NetworkingTracker />;
      case 'learning':
        return <LearningTracker />;
      case 'schedule':
        return <WeeklySchedule />;
      case 'tasks':
        return <TasksTracker />;  // Uses the imported component from ./components/TasksTracker
      case 'refresh':
        // Trigger manual refresh
        refreshData();
        setActiveTab('overview');
        return renderTabContent();
      default:
        return <div>Select a tab to view content</div>;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {isDemoMode && <DemoHeader />}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">DevOps Career Dashboard</h1>
          <div className="text-sm">
            {roadmapTitle ? (
              <>Roadmap: {roadmapTitle}</>
            ) : (
              <>Current Phase: {dashboardData.overview.phase || 'Loading'}
              {dashboardData.overview.currentWeek && ` (Week ${dashboardData.overview.currentWeek})`}</>
            )}
          </div>
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Sidebar Navigation */}
        <nav className="bg-gray-800 text-white w-full md:w-64 p-4">
          <ul>
            <NavItem icon={<BarChart2 size={20} />} label="Overview" id="overview" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem icon={<Award size={20} />} label="Skills Tracker" id="skills" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem icon={<Briefcase size={20} />} label="Projects" id="projects" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem icon={<Users size={20} />} label="Networking" id="networking" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem icon={<Book size={20} />} label="Learning" id="learning" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem icon={<Calendar size={20} />} label="Weekly Schedule" id="schedule" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem icon={<CheckSquare size={20} />} label="Tasks" id="tasks" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem icon={<RefreshCw size={20} />} label="Refresh Data" id="refresh" activeTab={activeTab} setActiveTab={setActiveTab} />
          </ul>
        </nav>
        
        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {renderTabContent()}
        </main>
      </div>
      
      <footer className="bg-gray-800 text-white p-4 text-center text-sm">
        <p>DevOps Career Tracker | Last Updated: {new Date().toLocaleDateString()}</p>
        <p className="text-xs mt-1">Inspired by John C. Maxwell: "Master the basics. Then practice them every day without fail."</p>
      </footer>
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ icon, label, id, activeTab, setActiveTab }) => (
  <li 
    className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${activeTab === id ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
    onClick={() => setActiveTab(id)}
  >
    {icon}
    <span>{label}</span>
  </li>
);

// Dashboard Card Components
const OverviewCard = ({ careerPhases }) => {
  const [showConfigForm, setShowConfigForm] = useState(false);
  
  if (!careerPhases) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Career Roadmap Progress</h2>
          <button
            onClick={() => setShowConfigForm(true)}
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-2 rounded"
          >
            Configure Roadmap
          </button>
        </div>
        
        {showConfigForm ? (
          <RoadmapConfigForm onClose={() => setShowConfigForm(false)} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No career roadmap has been configured yet.</p>
            <button
              onClick={() => setShowConfigForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Set Up Career Roadmap
            </button>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Career Roadmap Progress</h2>
        <button
          onClick={() => setShowConfigForm(true)}
          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-2 rounded"
        >
          Configure Roadmap
        </button>
      </div>
      
      {showConfigForm ? (
        <RoadmapConfigForm onClose={() => setShowConfigForm(false)} />
      ) : (
        <div className="space-y-4">
          {careerPhases.map(phase => (
            <div key={phase.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{phase.name}</span>
                <span>{phase.duration}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${phase.progress}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{phase.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Replaced with custom component
const OldWeeklyMetricsCard = ({ metrics }) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    <h2 className="text-xl font-bold mb-4">Weekly Metrics</h2>
    <div className="grid grid-cols-2 gap-4 text-center">
      <div className="bg-blue-50 p-3 rounded">
        <p className="text-2xl font-bold text-blue-600">{metrics.learningHours}</p>
        <p className="text-xs text-gray-500">Learning Hours</p>
        <p className="text-xs text-gray-400">Target: 25</p>
      </div>
      <div className="bg-green-50 p-3 rounded">
        <p className="text-2xl font-bold text-green-600">{metrics.projectHours}</p>
        <p className="text-xs text-gray-500">Project Hours</p>
        <p className="text-xs text-gray-400">Target: 12.5</p>
      </div>
      <div className="bg-purple-50 p-3 rounded">
        <p className="text-2xl font-bold text-purple-600">{metrics.networkingHours}</p>
        <p className="text-xs text-gray-500">Networking Hours</p>
        <p className="text-xs text-gray-400">Target: 7.5</p>
      </div>
      <div className="bg-yellow-50 p-3 rounded">
        <p className="text-2xl font-bold text-yellow-600">{metrics.newConnections}</p>
        <p className="text-xs text-gray-500">New Connections</p>
        <p className="text-xs text-gray-400">Target: 25-30</p>
      </div>
    </div>
  </div>
);

const UpcomingGoalsCard = () => {
  const { dashboardData } = useDashboard();
  
  if (!dashboardData) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Upcoming Goals</h2>
      <ul className="space-y-2">
        {dashboardData.goals.map((goal, index) => (
          <li key={index} className="flex items-start">
            <div className={`flex-shrink-0 h-5 w-5 rounded-full border-2 ${goal.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'} mt-0.5`}></div>
            <span className="ml-2 text-sm">{goal.content}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CertificationProgressCard = ({ certifications }) => {  
  if (!certifications) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Certification Progress</h2>
      <div className="space-y-4">
        {certifications.slice(0, 2).map(cert => (
          <div key={cert.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{cert.name}</span>
              <span className={`px-2 py-1 rounded text-xs ${
                cert.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                cert.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                'bg-gray-100 text-gray-800'
              }`}>{cert.status}</span>
            </div>
            <ProgressUpdater type="certification" item={cert} />
            <p className="text-xs text-gray-500 mt-1">Target: {cert.targetDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Content Tab Components
const SkillsTracker = ({ skills }) => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddSkillForm, setShowAddSkillForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  
  if (!skills) return null;
  
  const handleEditCategory = (categoryName) => {
    setEditingCategory(categoryName);
    setShowAddSkillForm(false);
    setShowImportForm(false);
  };
  
  const closeForm = () => {
    setEditingCategory(null);
  };
  
  const toggleAddSkillForm = () => {
    setShowAddSkillForm(!showAddSkillForm);
    setEditingCategory(null);
    setShowImportForm(false);
  };
  
  const toggleImportForm = () => {
    setShowImportForm(!showImportForm);
    setShowAddSkillForm(false);
    setEditingCategory(null);
  };
  
  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      case 'Beginner':
        return 'bg-blue-100 text-blue-800';
      case 'Intermediate':
        return 'bg-green-100 text-green-800';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800';
      case 'Expert':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Skills Tracker</h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleImportForm}
            className="bg-green-600 text-white px-3 py-2 rounded-md flex items-center"
          >
            <Plus size={18} className="mr-1" /> Import Skills
          </button>
          <button
            onClick={toggleAddSkillForm}
            className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center"
          >
            <Plus size={18} className="mr-1" /> Add Skill
          </button>
        </div>
      </div>
      
      {showAddSkillForm && (
        <AddSkillForm onClose={toggleAddSkillForm} />
      )}
      
      {showImportForm && (
        <ImportSkillsForm onClose={toggleImportForm} />
      )}
      
      {editingCategory && (
        <SkillsForm 
          category={editingCategory} 
          onClose={closeForm} 
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map(category => (
          <div key={category.category} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">{category.category}</h3>
              <button 
                onClick={() => handleEditCategory(category.category)}
                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-2 rounded"
              >
                Update
              </button>
            </div>
            <p className="text-sm mb-3">
              <span className={`px-2 py-1 rounded ${getProficiencyColor(category.proficiency)}`}>
                {category.proficiency}
              </span>
            </p>
            {category.skills.length > 0 ? (
              <ul className="space-y-1">
                {category.skills.map(skill => (
                  <li key={skill} className="text-sm">• {skill}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No skills recorded yet</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectsTracker = ({ projects }) => {
  const [showImportForm, setShowImportForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  if (!projects) return null;
  
  const toggleImportForm = () => {
    setShowImportForm(!showImportForm);
  };
  
  const handleViewDetails = (project) => {
    setSelectedProject(project);
  };
  
  const closeProjectDetails = () => {
    setSelectedProject(null);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects Tracker</h2>
        <button
          onClick={toggleImportForm}
          className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-1" /> Import Projects
        </button>
      </div>
      
      {showImportForm && (
        <ImportProjectsForm onClose={toggleImportForm} />
      )}
      
      {selectedProject && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold">{selectedProject.name}</h3>
            <button
              onClick={closeProjectDetails}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">{selectedProject.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="font-medium">{selectedProject.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Progress</p>
              <p className="font-medium">{selectedProject.progress}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Target Date</p>
              <p className="font-medium">{selectedProject.targetDate || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Repository</p>
              <p className="font-medium">
                {selectedProject.repository ? (
                  <a 
                    href={selectedProject.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Repository
                  </a>
                ) : (
                  'Not set'
                )}
              </p>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500 mb-2">Technologies</p>
            <div className="flex flex-wrap gap-2">
              {selectedProject.technologies && selectedProject.technologies.map((tech, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {tech}
                </span>
              ))}
              {(!selectedProject.technologies || selectedProject.technologies.length === 0) && (
                <span className="text-gray-500 italic">No technologies listed</span>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500 mb-2">Update Progress</p>
            <ProgressUpdater type="project" item={selectedProject} />
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => (
          <div key={project.name} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-bold mb-2">{project.name}</h3>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Status: {project.status}</span>
              <span className="text-gray-500">{project.progress}% Complete</span>
            </div>
            <ProgressUpdater type="project" item={project} />
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button 
                onClick={() => handleViewDetails(project)}
                className="bg-gray-100 text-gray-600 py-1 px-3 rounded text-sm hover:bg-gray-200"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
        <div 
          onClick={toggleImportForm}
          className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100"
        >
          <p className="text-xl font-bold">+ Add New Project</p>
          <p className="text-sm">Track a new portfolio project</p>
        </div>
      </div>
    </div>
  );
};


const NetworkingTracker = () => {
  const { dashboardData } = useDashboard();
  const [clayMetrics, setClayMetrics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [connected, setConnected] = useState(false);
  
  // Fetch Clay CRM data
  useEffect(() => {
    const fetchClayData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from Clay API
        try {
          const [metricsResult, activitiesResult, followUpsResult] = await Promise.all([
            fetchNetworkingMetrics(),
            fetchActivities(10),
            getUpcomingFollowUps(5)
          ]);
          
          setClayMetrics(metricsResult);
          setActivities(activitiesResult);
          setFollowUps(followUpsResult);
          setConnected(true);
        } catch (apiErr) {
          console.warn('Clay API fetch failed:', apiErr);
          setConnected(false);
        }
      } catch (err) {
        console.error('Error fetching Clay data:', err);
        setError('Failed to load networking data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClayData();
  }, []);
  
  const handleConnectionSuccess = () => {
    setShowConnectForm(false);
    window.location.reload(); // Reload to fetch Clay data
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  if (!dashboardData) return null;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Networking Tracker</h2>
      
      {showConnectForm ? (
        <ClayConnectForm onSuccess={handleConnectionSuccess} />
      ) : null}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold mb-4">Weekly Metrics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">New Connections:</span>
              <span className="font-medium">
                {connected && clayMetrics ? 
                  `${clayMetrics.newConnections}/25-30` : 
                  `${dashboardData.weeklyMetrics.newConnections}/25-30`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Connection Acceptance:</span>
              <span className="font-medium">
                {connected && clayMetrics ? 
                  `${clayMetrics.connectionAcceptanceRate}%` : 
                  '0%'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Content Pieces:</span>
              <span className="font-medium">
                {connected && clayMetrics ? 
                  `${clayMetrics.contentPieces}/1-2` : 
                  '0/1-2'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Engagement Rate:</span>
              <span className="font-medium">
                {connected && clayMetrics ? 
                  `${clayMetrics.engagementRate}%` : 
                  '0%'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Follow-ups Sent:</span>
              <span className="font-medium">
                {connected && clayMetrics ? 
                  clayMetrics.followUpsSent : 
                  '0'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold mb-4">Clay CRM Integration</h3>
          {connected ? (
            <>
              <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-3 text-sm">
                <p className="font-medium">🟢 Connected to Clay CRM</p>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Your Clay CRM account is connected and syncing data.
              </p>
              <button 
                onClick={() => setShowConnectForm(true)} 
                className="text-blue-600 bg-blue-50 hover:bg-blue-100 py-1 px-3 rounded text-sm w-full"
              >
                Reconnect
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">Connect Clay CRM to track your networking progress</p>
              <button 
                onClick={() => setShowConnectForm(true)} 
                className="bg-blue-100 text-blue-600 py-1 px-3 rounded text-sm w-full hover:bg-blue-200"
              >
                Connect Clay CRM
              </button>
            </>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold mb-4">Upcoming Follow-ups</h3>
          {connected && followUps.length > 0 ? (
            <div className="space-y-3">
              {followUps.map(followUp => (
                <div key={followUp.id} className="text-sm border-l-2 border-blue-500 pl-3">
                  <p className="font-medium">{followUp.contact.name}</p>
                  <p className="text-gray-600">{followUp.reason}</p>
                  <p className="text-xs text-gray-500">Due: {formatDate(followUp.date)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No follow-ups scheduled</p>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-bold mb-4">Networking Activity Log</h3>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {connected && activities.length > 0 ? (
              activities.map(activity => (
                <tr key={activity.id}>
                  <td className="py-2 px-3 text-sm">{formatDate(activity.date)}</td>
                  <td className="py-2 px-3 text-sm">
                    {activity.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </td>
                  <td className="py-2 px-3 text-sm">{activity.contact.name}</td>
                  <td className="py-2 px-3 text-sm">
                    {activity.details.message || 
                     activity.details.title || 
                     activity.details.content || 
                     activity.details.reminder || 
                     ''}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-3 px-3 text-sm" colSpan="4">
                  <div className="text-center text-gray-500 italic">
                    {connected ? 'No networking activities recorded' : 'Connect Clay CRM to view activities'}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {connected && (
        <div className="mt-6 grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-bold mb-4">Connection Management</h3>
            <p className="text-sm text-gray-500 mb-4">
              Visit your Clay CRM dashboard to manage your connections and follow-ups.
            </p>
            <a 
              href="https://clay.earth" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700"
            >
              Open Clay Dashboard
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const LearningTracker = () => {
  const { dashboardData } = useDashboard();
  const [showCourseProgressForm, setShowCourseProgressForm] = useState(false);
  const [showAddResourceForm, setShowAddResourceForm] = useState(false);
  const [showResourceProgressForm, setShowResourceProgressForm] = useState(false);
  const [showImportResourcesForm, setShowImportResourcesForm] = useState(false);
  
  if (!dashboardData) return null;
  
  const toggleCourseProgressForm = () => {
    setShowCourseProgressForm(!showCourseProgressForm);
    setShowResourceProgressForm(false);
    setShowAddResourceForm(false);
    setShowImportResourcesForm(false);
  };
  
  const toggleResourceProgressForm = () => {
    setShowResourceProgressForm(!showResourceProgressForm);
    setShowCourseProgressForm(false);
    setShowAddResourceForm(false);
    setShowImportResourcesForm(false);
  };
  
  const toggleAddResourceForm = () => {
    setShowAddResourceForm(!showAddResourceForm);
    setShowCourseProgressForm(false);
    setShowResourceProgressForm(false);
    setShowImportResourcesForm(false);
  };
  
  const toggleImportResourcesForm = () => {
    setShowImportResourcesForm(!showImportResourcesForm);
    setShowAddResourceForm(false);
    setShowCourseProgressForm(false);
    setShowResourceProgressForm(false);
  };
  
  // Use real course data from certificates/in-progress resources
  const courses = dashboardData.certifications
    .filter(cert => cert.status === 'In Progress')
    .map(cert => ({ name: cert.name, progress: cert.progress }));
    
  // Add any other courses that are tracked separately
  const additionalCourses = [
    { name: "Adrian Cantrill's AWS SAA", progress: 0 },
    { name: "How Linux Works", progress: 0 },
    { name: "The Linux Command Line", progress: 0 }
  ];
  
  const allCourses = [...courses, ...additionalCourses];
  
  // Filter resources by status
  const pendingResources = dashboardData.learningResources ? 
    dashboardData.learningResources.filter(r => r.status !== 'Completed') : [];
    
  const completedResources = dashboardData.learningResources ? 
    dashboardData.learningResources.filter(r => r.status === 'Completed') : [];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Learning Tracker</h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleImportResourcesForm}
            className="bg-green-600 text-white px-3 py-2 rounded-md flex items-center"
          >
            <Plus size={18} className="mr-1" /> Import Resources
          </button>
          <button
            onClick={toggleResourceProgressForm}
            className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center"
          >
            <Plus size={18} className="mr-1" /> Update Resource
          </button>
          <button
            onClick={toggleCourseProgressForm}
            className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center"
          >
            <Plus size={18} className="mr-1" /> Update Course
          </button>
        </div>
      </div>
      
      {showImportResourcesForm && (
        <ImportResourcesForm onClose={toggleImportResourcesForm} />
      )}
      
      {showResourceProgressForm && (
        <ResourceProgressForm onClose={toggleResourceProgressForm} />
      )}
      
      {showCourseProgressForm && (
        <CourseProgressForm onClose={toggleCourseProgressForm} />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold mb-4">Current Courses</h3>
          <div className="space-y-4">
            {allCourses.map(course => (
              <div key={course.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{course.name}</span>
                  <span>{course.progress}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold mb-4">Learning Hours Log</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">This Week:</span>
              <span className="font-medium">{dashboardData.weeklyMetrics.learningHours || 0}/25 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Week:</span>
              <span className="font-medium">0 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">{dashboardData.weeklyMetrics.learningHours || 0} hours</span>
            </div>
          </div>
          <div className="mt-4">
            <button onClick={() => window.alert('Use the clock icon in the Weekly Metrics card to log hours')} className="bg-blue-100 text-blue-600 py-1 px-3 rounded text-sm w-full">Log Learning Hours</button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold mb-4">Completed Resources</h3>
          {completedResources.length > 0 ? (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {completedResources.map(resource => (
                  <tr key={resource.id}>
                    <td className="py-2 px-3 text-sm">
                      {resource.url ? (
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {resource.name}
                        </a>
                      ) : (
                        resource.name
                      )}
                    </td>
                    <td className="py-2 px-3 text-sm">{resource.type}</td>
                    <td className="py-2 px-3 text-sm">{resource.dateAdded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-500 italic">No completed resources yet</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Resource Queue</h3>
            <div className="flex space-x-2">
              <button
                onClick={toggleImportResourcesForm}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs py-1 px-2 rounded flex items-center"
              >
                <Plus size={16} className="mr-1" /> Import Resources
              </button>
              <button
                onClick={toggleAddResourceForm}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs py-1 px-2 rounded flex items-center"
              >
                <Plus size={16} className="mr-1" /> Add Resource
              </button>
            </div>
          </div>
          
          {showAddResourceForm && (
            <AddResourceForm onClose={toggleAddResourceForm} />
          )}
          
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingResources.length > 0 ? (
                pendingResources.map(resource => (
                  <tr key={resource.id}>
                    <td className="py-2 px-3 text-sm">
                      {resource.url ? (
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {resource.name}
                        </a>
                      ) : (
                        resource.name
                      )}
                    </td>
                    <td className="py-2 px-3 text-sm">{resource.type}</td>
                    <td className="py-2 px-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        resource.priority === 'high' ? 'bg-red-100 text-red-800' :
                        resource.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {resource.priority}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-sm">
                      {resource.status === 'Scheduled' && resource.targetMonth
                        ? `Scheduled for ${resource.targetMonth}` 
                        : resource.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-sm text-gray-500 italic">
                    No resources in queue
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const WeeklySchedule = () => {
  const { dashboardData } = useDashboard();
  const [showImportForm, setShowImportForm] = useState(false);
  
  if (!dashboardData) return null;
  
  const toggleImportForm = () => {
    setShowImportForm(!showImportForm);
  };
  
  // Define default values if schedule is not set yet
  const schedule = dashboardData.schedule || {
    timeAllocation: {
      learning: 25,
      projects: 12.5,
      networking: 7.5,
      content: 5,
      total: 50
    },
    dailySchedule: {}
  };
  
  // Calculate percentages for time allocation visualization
  const learningPercent = Math.round((schedule.timeAllocation?.learning || 25) / (schedule.timeAllocation?.total || 50) * 100);
  const projectsPercent = Math.round((schedule.timeAllocation?.projects || 12.5) / (schedule.timeAllocation?.total || 50) * 100);
  const networkingPercent = Math.round((schedule.timeAllocation?.networking || 7.5) / (schedule.timeAllocation?.total || 50) * 100);
  const contentPercent = Math.round((schedule.timeAllocation?.content || 5) / (schedule.timeAllocation?.total || 50) * 100);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Weekly Schedule</h2>
        <button
          onClick={toggleImportForm}
          className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-1" /> Import Schedule
        </button>
      </div>
      
      {showImportForm && (
        <ImportScheduleForm onClose={toggleImportForm} />
      )}
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold mb-4">
            Time Allocation ({schedule.timeAllocation?.total || 50} hrs/week)
          </h3>
          <div className="w-full bg-gray-200 rounded-full h-6">
            <div className="flex">
              <div 
                className="bg-blue-600 h-6 rounded-l-full text-xs text-white flex items-center justify-center" 
                style={{ width: `${learningPercent}%` }}
              >
                Learning ({schedule.timeAllocation?.learning || 25}h)
              </div>
              <div 
                className="bg-green-500 h-6 text-xs text-white flex items-center justify-center" 
                style={{ width: `${projectsPercent}%` }}
              >
                Projects ({schedule.timeAllocation?.projects || 12.5}h)
              </div>
              <div 
                className="bg-purple-500 h-6 text-xs text-white flex items-center justify-center" 
                style={{ width: `${networkingPercent}%` }}
              >
                Networking ({schedule.timeAllocation?.networking || 7.5}h)
              </div>
              <div 
                className="bg-yellow-500 h-6 rounded-r-full text-xs text-white flex items-center justify-center" 
                style={{ width: `${contentPercent}%` }}
              >
                Content ({schedule.timeAllocation?.content || 5}h)
              </div>
            </div>
          </div>
        </div>
        
        {dashboardData.schedule ? (
          <div className="grid grid-cols-7 gap-2">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
              <div key={day} className="bg-white rounded-lg shadow-md p-3">
                <h4 className="font-bold text-center border-b pb-2 mb-2">{day}</h4>
                <div className="space-y-2">
                  {dashboardData.schedule.dailySchedule[day]?.map((activity, index) => (
                    <div 
                      key={index} 
                      className={`p-2 rounded text-xs ${
                        activity.category === 'Learning' ? 'bg-blue-50 text-blue-800' :
                        activity.category === 'Projects' ? 'bg-green-50 text-green-800' :
                        activity.category === 'Networking' ? 'bg-purple-50 text-purple-800' :
                        activity.category === 'Content' ? 'bg-yellow-50 text-yellow-800' :
                        'bg-gray-50 text-gray-800'
                      }`}
                    >
                      <p className="font-medium">{activity.time}</p>
                      <p>{activity.activity}</p>
                    </div>
                  ))}
                  {(!dashboardData.schedule.dailySchedule[day] || 
                    dashboardData.schedule.dailySchedule[day].length === 0) && (
                    <div className="p-2 text-xs text-gray-500 italic text-center">
                      No activities scheduled
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 mb-4">No schedule has been set up yet.</p>
            <button
              onClick={toggleImportForm}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Import a Schedule Template
            </button>
          </div>
        )}
        
        {dashboardData.schedule && <WeeklyScheduleStats />}
      </div>
    </div>
  );
};

// Legacy code, replaced by the imported TasksTracker component
const OldTasksTracker = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Tasks Tracker</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Contents removed as we're using the new component */}
    </div>
  </div>
);

export default Dashboard;