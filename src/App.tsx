import React from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import DashboardTab from './components/DashboardTab';
import ApplicantsTab from './components/ApplicantsTab';
import ReportsTab from './components/ReportsTab';

function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [activeProgram, setActiveProgram] = React.useState<'GIP' | 'TUPAD'>('GIP');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'applicants':
        return <ApplicantsTab activeProgram={activeProgram} />;
      case 'reports':
        return <ReportsTab activeProgram={activeProgram} />;
      default:
        return <DashboardTab activeProgram={activeProgram} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header activeProgram={activeProgram} onProgramChange={setActiveProgram} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} activeProgram={activeProgram} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default App;