import React from 'react';
import HeroSection from './HeroSection';
import StatsGrid from './StatsGrid';

const DashboardTab: React.FC = () => {
  return (
    <>
      <HeroSection />
      <StatsGrid />
    </>
  );
};

export default DashboardTab;