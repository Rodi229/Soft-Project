import React from 'react';
import StatsCards from './StatsCards';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import ApplicationActions from './ApplicantActions';

const DashboardContent: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Sarah!</h1>
        <p className="text-gray-600">Here's what's happening with your business today.</p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <ApplicationActions />
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-6">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;