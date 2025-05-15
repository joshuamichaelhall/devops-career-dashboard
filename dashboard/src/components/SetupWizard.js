import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { getBeginnerSkills, getTrackSpecificSkills, getAllSkills } from '../data/templates/skills-template';

/**
 * Setup Wizard Component
 * Helps new users configure their dashboard with initial settings
 */
const SetupWizard = ({ onComplete }) => {
  const { updateSkills, addTask, addLearningResource, updateCertificationProgress } = useDashboard();
  
  const [step, setStep] = useState(1);
  const [careerStage, setCareerStage] = useState('early'); // early, mid, senior
  const [focusAreas, setFocusAreas] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [name, setName] = useState('');
  
  // Available options
  const careerStages = [
    { id: 'early', name: 'Early Career (0-2 years)', description: 'Focus on foundational skills and certifications' },
    { id: 'mid', name: 'Mid Career (2-5 years)', description: 'Specialize and build advanced expertise' },
    { id: 'senior', name: 'Senior (5+ years)', description: 'Leadership, architecture, and mentoring' }
  ];
  
  const skillAreas = [
    { id: 'aws', name: 'AWS/Cloud', description: 'Amazon Web Services and cloud infrastructure' },
    { id: 'terraform', name: 'Terraform/IaC', description: 'Infrastructure as Code' },
    { id: 'kubernetes', name: 'Kubernetes', description: 'Container orchestration' },
    { id: 'cicd', name: 'CI/CD', description: 'Continuous integration and deployment' },
    { id: 'monitoring', name: 'Monitoring', description: 'Observability and metrics' },
    { id: 'security', name: 'DevSecOps', description: 'Security automation and compliance' }
  ];
  
  const certificationOptions = [
    { id: 'aws-cp', name: 'AWS Cloud Practitioner', level: 'Beginner', category: 'aws' },
    { id: 'aws-saa', name: 'AWS Solutions Architect Associate', level: 'Intermediate', category: 'aws' },
    { id: 'aws-dev', name: 'AWS Developer Associate', level: 'Intermediate', category: 'aws' },
    { id: 'aws-sysops', name: 'AWS SysOps Administrator', level: 'Intermediate', category: 'aws' },
    { id: 'terraform', name: 'HashiCorp Terraform Associate', level: 'Intermediate', category: 'terraform' },
    { id: 'cka', name: 'Certified Kubernetes Administrator', level: 'Advanced', category: 'kubernetes' },
    { id: 'ckad', name: 'Certified Kubernetes Application Developer', level: 'Advanced', category: 'kubernetes' }
  ];
  
  // Toggle focus area selection
  const toggleFocusArea = (areaId) => {
    if (focusAreas.includes(areaId)) {
      setFocusAreas(focusAreas.filter(id => id !== areaId));
    } else {
      setFocusAreas([...focusAreas, areaId]);
    }
  };
  
  // Toggle certification selection
  const toggleCertification = (certId) => {
    if (certifications.includes(certId)) {
      setCertifications(certifications.filter(id => id !== certId));
    } else {
      setCertifications([...certifications, certId]);
    }
  };
  
  // Submit the form and create initial dashboard data
  const handleSubmit = async () => {
    try {
      // 1. Set up skills based on career stage and focus areas
      const skillsToAdd = [];
      
      // Generate appropriate skill set based on career stage
      const baseSkills = getBeginnerSkills(careerStage);
      
      // Add skills and filter based on focus areas
      const selectedSkillCategories = baseSkills.filter(category => {
        // Keep only the categories that are in the selected focus areas
        // or essential categories like Scripting that should always be included
        const matchingArea = skillAreas.find(area => 
          category.category.toLowerCase().includes(area.name.toLowerCase()) && 
          focusAreas.includes(area.id)
        );
        
        // Always include Scripting and essential categories
        return matchingArea || category.category === "Scripting";
      });
      
      // Update skills in the backend
      try {
        // Update the skills section via the dashboard API
        const response = await fetch('http://localhost:3001/api/data/skills', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedSkillCategories),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update skills');
        }
      } catch (err) {
        console.error('Error bulk updating skills:', err);
        
        // Fallback to individual skill updates
        for (const category of selectedSkillCategories) {
          for (const skill of category.skills) {
            try {
              await updateSkills(category.category, skill, 'Beginner');
            } catch (skillError) {
              console.error(`Error adding skill ${skill}:`, skillError);
            }
          }
        }
      }
      
      // 2. Process selected focus areas - add tasks
      for (const areaId of focusAreas) {
        const area = skillAreas.find(a => a.id === areaId);
        if (area) {
          // Add as a task
          await addTask(`Improve ${area.name} skills`, 'skill', 'high');
        }
      }
      
      // 3. Process selected certifications
      for (const certId of certifications) {
        const cert = certificationOptions.find(c => c.id === certId);
        if (cert) {
          // Add certification with 0% progress
          await updateCertificationProgress(cert.name, 0, 'Planned');
          
          // Add as a task
          await addTask(`Complete ${cert.name} certification`, 'certification', 'high');
          
          // Add related learning resource
          await addLearningResource({
            name: `${cert.name} Preparation`,
            type: 'course',
            priority: 'high',
            status: 'Scheduled',
            targetMonth: 'Next Month'
          });
        }
      }
      
      // Complete the wizard
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error setting up dashboard:', error);
    }
  };
  
  // Render the appropriate step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="wizard-step">
            <h2 className="text-xl font-bold mb-4">Welcome to Your DevOps Career Dashboard</h2>
            <p className="mb-6">Let's set up your dashboard in a few quick steps to match your career goals.</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">What's your name?</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select your career stage:</label>
              <div className="space-y-2">
                {careerStages.map(stage => (
                  <div 
                    key={stage.id}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${careerStage === stage.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => setCareerStage(stage.id)}
                  >
                    <div className="font-medium">{stage.name}</div>
                    <div className="text-sm text-gray-500">{stage.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="wizard-step">
            <h2 className="text-xl font-bold mb-4">Select Your Focus Areas</h2>
            <p className="mb-6">Choose the DevOps areas you want to focus on in your career dashboard.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {skillAreas.map(area => (
                <div 
                  key={area.id}
                  className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${focusAreas.includes(area.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                  onClick={() => toggleFocusArea(area.id)}
                >
                  <div className="font-medium">{area.name}</div>
                  <div className="text-sm text-gray-500">{area.description}</div>
                </div>
              ))}
            </div>
            
            <div className="text-sm text-gray-500 mb-4">
              Selected: {focusAreas.length} of {skillAreas.length} areas
            </div>
          </div>
        );
        
      case 3:
        // Filter certifications based on career stage and selected focus areas
        const filteredCerts = certificationOptions.filter(cert => {
          // Show all relevant certs for the selected focus areas
          return focusAreas.includes(cert.category) &&
            // Filter by level based on career stage
            ((careerStage === 'early' && cert.level !== 'Advanced') ||
             (careerStage === 'mid') ||
             (careerStage === 'senior'));
        });
        
        return (
          <div className="wizard-step">
            <h2 className="text-xl font-bold mb-4">Select Target Certifications</h2>
            <p className="mb-6">Choose certifications you're interested in pursuing.</p>
            
            {filteredCerts.length > 0 ? (
              <div className="space-y-2 mb-4">
                {filteredCerts.map(cert => (
                  <div 
                    key={cert.id}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${certifications.includes(cert.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => toggleCertification(cert.id)}
                  >
                    <div className="font-medium">{cert.name}</div>
                    <div className="text-sm text-gray-500">Level: {cert.level}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 text-yellow-800 rounded mb-4">
                No certifications match your selected focus areas. Please go back and select different areas.
              </div>
            )}
            
            <div className="text-sm text-gray-500 mb-4">
              Selected: {certifications.length} of {filteredCerts.length} certifications
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="wizard-step">
            <h2 className="text-xl font-bold mb-4">Ready to Start Your DevOps Journey</h2>
            <p className="mb-6">We're about to create your personalized dashboard with the following:</p>
            
            <div className="bg-gray-50 p-4 rounded mb-6">
              <div className="mb-2"><strong>Name:</strong> {name || 'Not provided'}</div>
              <div className="mb-2"><strong>Career Stage:</strong> {careerStages.find(s => s.id === careerStage)?.name}</div>
              <div className="mb-2">
                <strong>Focus Areas:</strong>
                <ul className="list-disc pl-5 mt-1">
                  {focusAreas.map(id => (
                    <li key={id}>{skillAreas.find(a => a.id === id)?.name}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Target Certifications:</strong>
                <ul className="list-disc pl-5 mt-1">
                  {certifications.map(id => (
                    <li key={id}>{certificationOptions.find(c => c.id === id)?.name}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <p className="mb-6">Your dashboard will be configured with these settings, but you can customize everything later.</p>
            
            <div className="text-sm text-gray-500">
              Tip: Use the 'Tasks' and 'Skills' tabs to further customize your career tracking.
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="setup-wizard bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map(stepNumber => (
            <div 
              key={stepNumber}
              className={`rounded-full h-8 w-8 flex items-center justify-center font-medium ${
                stepNumber === step 
                  ? 'bg-blue-600 text-white'
                  : stepNumber < step
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-500'
              }`}
            >
              {stepNumber}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Step content */}
      {renderStep()}
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
        ) : (
          <div></div>
        )}
        
        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create My Dashboard
          </button>
        )}
      </div>

      {/* Tooltips */}
      <div className="mt-6 p-3 bg-blue-50 text-blue-800 rounded text-sm">
        <div className="font-medium mb-1">💡 Tip:</div>
        {step === 1 && (
          <div>Choose your career stage carefully as it affects recommended certifications and learning paths.</div>
        )}
        {step === 2 && (
          <div>Focus areas help prioritize your learning and development efforts. Select 2-4 areas for best results.</div>
        )}
        {step === 3 && (
          <div>Certifications provide structured learning paths and validate your skills to employers.</div>
        )}
        {step === 4 && (
          <div>Your dashboard will evolve as you progress. Remember to update your skills and complete tasks regularly.</div>
        )}
      </div>
    </div>
  );
};

export default SetupWizard;