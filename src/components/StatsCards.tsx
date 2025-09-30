import React from 'react';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, BarChart3 } from 'lucide-react';

const StatsCards: React.FC = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Active Users',
      value: '2,341',
      change: '+8.2%',
      isPositive: true,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: '1,423',
      change: '-2.4%',
      isPositive: false,
      icon: ShoppingCart,
      color: 'bg-purple-500',
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+5.1%',
      isPositive: true,
      icon: BarChart3,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.isPositive ? TrendingUp : TrendingDown;
        
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                stat.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendIcon className="w-4 h-4" />
                <span className="font-medium">{stat.change}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;