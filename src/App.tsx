import React from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import DashboardTab from './components/DashboardTab';
import ApplicantsTab from './components/ApplicantsTab';
import ReportsTab from './components/ReportsTab';

function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'applicants':
        return <ApplicantsTab />;
      case 'reports':
        return <ReportsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default App;