import React from 'react';

/**
 * Demo header component that displays a prominent "DEMO" banner
 * Only shown in demo mode
 */
const DemoHeader = () => {
  return (
    <div className="demo-header">
      <div className="demo-banner">
        <div className="demo-banner-content">
          <span className="demo-label">DEMO</span>
          <span className="demo-description">This is a demonstration with sample data. Navigate freely but changes won't be saved.</span>
          <a href="https://github.com/joshuamichaelhall/devops-career-dashboard" 
             className="demo-github-link" 
             target="_blank" 
             rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
      </div>
      
      <style jsx="true">{`
        .demo-header {
          width: 100%;
          margin-bottom: 1rem;
        }
        .demo-banner {
          background: linear-gradient(135deg, #f5365c 0%, #f56036 100%);
          color: white;
          padding: 0.5rem 0;
          text-align: center;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .demo-banner-content {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 0 1rem;
        }
        .demo-label {
          font-weight: bold;
          font-size: 1rem;
          background-color: rgba(0,0,0,0.2);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }
        .demo-description {
          font-size: 0.9rem;
        }
        .demo-github-link {
          background: rgba(255,255,255,0.2);
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          text-decoration: none;
          transition: background 0.3s;
        }
        .demo-github-link:hover {
          background: rgba(255,255,255,0.3);
        }
        
        @media (max-width: 768px) {
          .demo-banner-content {
            flex-direction: column;
            gap: 0.5rem;
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DemoHeader;