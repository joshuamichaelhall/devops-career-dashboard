import React from 'react';
import Dashboard from './Dashboard';
import { DashboardProvider } from './context/DashboardContext';
import { DemoModeProvider, DemoWatermark } from './components/DemoMode';

function App() {
  return (
    <DemoModeProvider>
      <DashboardProvider>
        <Dashboard />
        <DemoWatermark />
      </DashboardProvider>
    </DemoModeProvider>
  );
}

export default App;