import React from 'react';
import { TrendingUp } from 'lucide-react';

const AnalyticsChart: React.FC = () => {
  const data = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 78 },
    { month: 'Mar', value: 52 },
    { month: 'Apr', value: 94 },
    { month: 'May', value: 87 },
    { month: 'Jun', value: 69 },
    { month: 'Jul', value: 95 },
    { month: 'Aug', value: 88 },
    { month: 'Sep', value: 76 },
    { month: 'Oct', value: 92 },
    { month: 'Nov', value: 85 },
    { month: 'Dec', value: 98 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
          <p className="text-sm text-gray-600">Monthly revenue trends</p>
        </div>
        <div className="flex items-center space-x-2 text-green-600">
          <TrendingUp className="w-5 h-5" />
          <span className="text-sm font-medium">+15.3% from last year</span>
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="h-64 flex items-end justify-between space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md hover:from-blue-600 hover:to-blue-500 transition-colors duration-200 cursor-pointer"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
              title={`${item.month}: ${item.value}%`}
            />
            <span className="text-xs text-gray-500 mt-2">{item.month}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-600">Average</p>
          <p className="text-xl font-semibold text-gray-900">82.5%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Peak</p>
          <p className="text-xl font-semibold text-gray-900">98%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Growth</p>
          <p className="text-xl font-semibold text-green-600">+15.3%</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;