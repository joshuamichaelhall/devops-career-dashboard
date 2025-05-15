import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

/**
 * Data Manager Component
 * Provides data import/export functionality for the dashboard
 */
const DataManager = ({ onClose }) => {
  const { dashboardData, refreshData } = useDashboard();
  const [importedData, setImportedData] = useState(null);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('export'); // 'export' or 'import'
  
  // Function to download data as JSON file
  const exportData = () => {
    try {
      // Create a JSON string of the dashboard data
      const dataStr = JSON.stringify(dashboardData, null, 2);
      
      // Create a Blob with the data
      const blob = new Blob([dataStr], { type: 'application/json' });
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename with date stamp
      const date = new Date().toISOString().split('T')[0];
      link.download = `dashboard-data-${date}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };
  
  // Function to handle file selection for import
  const handleFileSelect = (event) => {
    setImportError(null);
    setImportSuccess(false);
    
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if it's a JSON file
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setImportError('Please select a valid JSON file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        validateImportData(data);
        setImportedData(data);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        setImportError('Invalid JSON format');
      }
    };
    reader.readAsText(file);
  };
  
  // Function to validate imported data
  const validateImportData = (data) => {
    // Check for required top-level sections
    const requiredSections = ['overview', 'weeklyMetrics', 'skills', 'goals'];
    const missingSections = requiredSections.filter(section => !data[section]);
    
    if (missingSections.length > 0) {
      setImportError(`Missing required data sections: ${missingSections.join(', ')}`);
      return false;
    }
    
    setImportError(null);
    return true;
  };
  
  // Function to import data
  const importData = async () => {
    if (!importedData) return;
    
    try {
      // Create a backup first
      await backupCurrentData();
      
      // Write the imported data to localStorage
      localStorage.setItem('dashboard_data', JSON.stringify(importedData));
      
      // Refresh the dashboard
      refreshData();
      
      setImportSuccess(true);
      setTimeout(() => {
        setImportSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error importing data:', error);
      setImportError('Failed to import data');
    }
  };
  
  // Function to backup current data before import
  const backupCurrentData = async () => {
    try {
      // Only backup if we have data
      if (!dashboardData) return;
      
      // Create a timestamped backup
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupKey = `dashboard_backup_${timestamp}`;
      
      // Store backup in localStorage
      localStorage.setItem(backupKey, JSON.stringify(dashboardData));
      
      // Keep track of backups
      const backups = JSON.parse(localStorage.getItem('dashboard_backups') || '[]');
      backups.push({ key: backupKey, timestamp });
      
      // Limit to 10 most recent backups
      if (backups.length > 10) {
        const oldBackup = backups.shift();
        localStorage.removeItem(oldBackup.key);
      }
      
      localStorage.setItem('dashboard_backups', JSON.stringify(backups));
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  };
  
  // Function to import a template
  const importTemplate = async (templateName) => {
    try {
      setImportError(null);
      
      // Fetch the template data
      const response = await fetch(`/data/templates/${templateName}.json`);
      const templateData = await response.json();
      
      setImportedData(templateData);
    } catch (error) {
      console.error('Error loading template:', error);
      setImportError('Failed to load template');
    }
  };
  
  return (
    <div className="data-manager bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard Data Manager</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'export' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('export')}
          >
            Export Data
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'import' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('import')}
          >
            Import Data
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'templates' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('templates')}
          >
            Career Templates
          </button>
        </div>
      </div>
      
      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="export-section">
          <p className="mb-4">Export your current dashboard data to a JSON file. You can use this file for backup or to transfer to another device.</p>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Export includes:</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>All your personal dashboard metrics and settings</li>
              <li>Your skills, certifications, and project data</li>
              <li>Learning resources and task tracking information</li>
              <li>All customizations you've made to the dashboard</li>
            </ul>
          </div>
          
          <button
            onClick={exportData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export Dashboard Data
          </button>
          
          {exportSuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
              ✓ Dashboard data exported successfully!
            </div>
          )}
        </div>
      )}
      
      {/* Import Tab */}
      {activeTab === 'import' && (
        <div className="import-section">
          <p className="mb-4">Import dashboard data from a previously exported JSON file.</p>
          
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium mb-2 text-yellow-800">⚠️ Warning:</h3>
            <p className="text-sm text-yellow-800">
              Importing data will replace your current dashboard. A backup of your current data will be created automatically.
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select JSON data file:</label>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          
          {importError && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
              ⚠️ {importError}
            </div>
          )}
          
          {importedData && !importError && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
              ✓ Data file validated successfully! Click "Import Data" to proceed.
            </div>
          )}
          
          <button
            onClick={importData}
            disabled={!importedData || importError}
            className={`px-4 py-2 rounded ${!importedData || importError 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Import Data
          </button>
          
          {importSuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
              ✓ Dashboard data imported successfully! Refreshing...
            </div>
          )}
        </div>
      )}
      
      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="templates-section">
          <p className="mb-4">Start with a pre-configured career template based on your experience level.</p>
          
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium mb-2 text-yellow-800">⚠️ Note:</h3>
            <p className="text-sm text-yellow-800">
              Templates will replace your current dashboard data. A backup of your current data will be created automatically.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => importTemplate('early-career')}>
              <h3 className="font-medium mb-1">Early Career Template (0-2 years)</h3>
              <p className="text-sm text-gray-600 mb-2">For those starting their DevOps journey or transitioning from another field.</p>
              <ul className="list-disc pl-5 text-xs text-gray-500 space-y-1">
                <li>AWS Cloud Practitioner focus</li>
                <li>Basic Docker and Linux skills</li>
                <li>Foundation projects and learning</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => importTemplate('mid-career')}>
              <h3 className="font-medium mb-1">Mid-Career Template (2-5 years)</h3>
              <p className="text-sm text-gray-600 mb-2">For engineers growing their skills and specializing in DevOps domains.</p>
              <ul className="list-disc pl-5 text-xs text-gray-500 space-y-1">
                <li>AWS DevOps Professional focus</li>
                <li>Kubernetes and CI/CD specialization</li>
                <li>Advanced infrastructure as code</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => importTemplate('senior-career')}>
              <h3 className="font-medium mb-1">Senior Career Template (5+ years)</h3>
              <p className="text-sm text-gray-600 mb-2">For experienced engineers focusing on leadership and architecture.</p>
              <ul className="list-disc pl-5 text-xs text-gray-500 space-y-1">
                <li>Platform engineering leadership</li>
                <li>Advanced security specialization</li>
                <li>Technical mentorship and conference speaking</li>
              </ul>
            </div>
          </div>
          
          {importError && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
              ⚠️ {importError}
            </div>
          )}
          
          {importedData && !importError && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-2 text-blue-800">Template Selected!</h3>
              <p className="text-sm text-blue-800 mb-4">
                The template has been loaded and is ready to apply to your dashboard.
              </p>
              <button
                onClick={importData}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Apply Template
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Help Section */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm">
        <h3 className="font-medium mb-2 text-blue-800">Need help?</h3>
        <p className="text-blue-800">
          The dashboard maintains automatic backups of your data. If you need to recover a previous version,
          check the Settings tab or contact support.
        </p>
      </div>
    </div>
  );
};

export default DataManager;