import React from 'react';
import { Users, Clock, UserCheck, CheckCircle, X, UserMinus, MapPin } from 'lucide-react';

interface StatsGridProps {
  activeProgram: 'GIP' | 'TUPAD';
}

interface Stat {
  title: string;
  value: string;
  male: string;
  female: string;
  icon: any;
  bgColor: string;
  iconBg: string;
}

const StatsGrid: React.FC<StatsGridProps> = ({ activeProgram }) => {
  const primaryColor = activeProgram === 'GIP' ? 'bg-red-500' : 'bg-green-500';
  const primaryDarkColor = activeProgram === 'GIP' ? 'bg-red-600' : 'bg-green-600';
  const secondaryColor = activeProgram === 'GIP' ? 'bg-orange-500' : 'bg-blue-500';
  const secondaryDarkColor = activeProgram === 'GIP' ? 'bg-orange-600' : 'bg-blue-600';

  const stats: Stat[] = [
    {
      title: 'TOTAL APPLICANTS',
      value: '0',
      male: '0',
      female: '0',
      icon: Users,
      bgColor: primaryColor,
      iconBg: primaryDarkColor,
    },
    {
      title: 'PENDING',
      value: '0',
      male: '0',
      female: '0',
      icon: Clock,
      bgColor: secondaryColor,
      iconBg: secondaryDarkColor,
    },
    {
      title: 'APPROVED',
      value: '0',
      male: '0',
      female: '0',
      icon: UserCheck,
      bgColor: 'bg-blue-500',
      iconBg: 'bg-blue-600',
    },
    {
      title: 'DEPLOYED',
      value: '0',
      male: '0',
      female: '0',
      icon: CheckCircle,
      bgColor: 'bg-green-500',
      iconBg: 'bg-green-600',
    },
    {
      title: 'COMPLETED',
      value: '0',
      male: '0',
      female: '0',
      icon: CheckCircle,
      bgColor: 'bg-pink-400',
      iconBg: 'bg-pink-500',
    },
    {
      title: 'REJECTED',
      value: '0',
      male: '0',
      female: '0',
      icon: X,
      bgColor: 'bg-orange-500',
      iconBg: 'bg-orange-600',
    },
    {
      title: 'RESIGNED',
      value: '0',
      male: '0',
      female: '0',
      icon: UserMinus,
      bgColor: 'bg-gray-500',
      iconBg: 'bg-gray-600',
    },
    {
      title: 'BARANGAYS COVERED',
      value: '0',
      male: '0',
      female: '0',
      icon: MapPin,
      bgColor: 'bg-gray-600',
      iconBg: 'bg-gray-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} text-white rounded-lg p-6 relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium opacity-90 mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.iconBg} p-3 rounded-full`}>
                <Icon className="w-8 h-8" />
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs opacity-75">
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{stat.male}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{stat.female}</span>
              </div>
            </div>

            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Icon className="w-20 h-20" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
