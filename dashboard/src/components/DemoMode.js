import React from 'react';

/**
 * Demo mode context and provider
 * Provides demo mode state and utilities throughout the application
 */
import { createContext, useContext, useEffect, useState } from 'react';

// Create context
const DemoModeContext = createContext({
  isDemoMode: false,
  demoUser: null
});

/**
 * Demo mode provider component
 * Detects demo mode and provides context to child components
 */
export const DemoModeProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoUser, setDemoUser] = useState(null);
  
  useEffect(() => {
    // Check if we're in demo mode based on environment variable or URL
    const checkDemoMode = () => {
      // Check for environment variable
      const envDemoMode = process.env.REACT_APP_DEMO_MODE === 'true';
      
      // Check URL for demo parameter
      const urlParams = new URLSearchParams(window.location.search);
      const urlDemoMode = urlParams.get('demo') === 'true';
      
      // Check if domain is the demo domain
      const isDemoDomain = window.location.hostname === 'devops-dashboard.joshuamichaelhall.com';
      
      // Set demo mode if any condition is true
      setIsDemoMode(envDemoMode || urlDemoMode || isDemoDomain);
      
      // Check for demo user in localStorage
      const userJson = localStorage.getItem('dashboard_user');
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          if (user.isDemoUser) {
            setDemoUser(user);
          }
        } catch (e) {
          console.error('Error parsing user JSON:', e);
        }
      }
    };
    
    checkDemoMode();
  }, []);
  
  // Demo mode context value
  const value = {
    isDemoMode,
    demoUser,
    isDemoUser: (user) => user && user.isDemoUser
  };
  
  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
};

/**
 * Hook to use demo mode context
 */
export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};

/**
 * Watermark component for demo mode
 */
export const DemoWatermark = () => {
  const { isDemoMode } = useDemoMode();
  
  if (!isDemoMode) return null;
  
  return (
    <div className="demo-watermark">
      <span>DEMO</span>
      
      <style jsx="true">{`
        .demo-watermark {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 100;
          user-select: none;
        }
        .demo-watermark span {
          font-size: 20vw;
          color: rgba(245, 54, 92, 0.05);
          font-weight: bold;
          transform: rotate(-45deg);
        }
      `}</style>
    </div>
  );
};

export default { DemoModeProvider, useDemoMode, DemoWatermark };