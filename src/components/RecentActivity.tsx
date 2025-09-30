import React from 'react';
import { User, ShoppingCart, FileText, Settings, Clock } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      icon: User,
      title: 'New user registered',
      description: 'John Doe joined the platform',
      time: '2 minutes ago',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: ShoppingCart,
      title: 'Order completed',
      description: 'Order #1234 has been delivered',
      time: '15 minutes ago',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: FileText,
      title: 'Report generated',
      description: 'Monthly sales report is ready',
      time: '1 hour ago',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Settings,
      title: 'System updated',
      description: 'Application updated to v2.1.0',
      time: '2 hours ago',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: User,
      title: 'Profile updated',
      description: 'Sarah updated her profile picture',
      time: '3 hours ago',
      color: 'bg-gray-100 text-gray-600',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                <div className="flex items-center mt-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;