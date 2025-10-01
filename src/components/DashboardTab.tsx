import React from 'react';
import HeroSection from './HeroSection';
import StatsGrid from './StatsGrid';

interface DashboardTabProps {
  activeProgram: 'GIP' | 'TUPAD';
}

const DashboardTab: React.FC<DashboardTabProps> = ({ activeProgram }) => {
  return (
    <>
      <HeroSection activeProgram={activeProgram} />
      <StatsGrid activeProgram={activeProgram} />
    </>
  );
};

export default DashboardTab;