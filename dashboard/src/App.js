import React from 'react';
import Dashboard from './Dashboard';
import { DashboardProvider } from './context/DashboardContext';

function App() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}

export default App;