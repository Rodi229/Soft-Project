import React from 'react';
import { Plus, Upload, Download, Send, Edit, Trash2 } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    { icon: Plus, label: 'Create New', color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: Upload, label: 'Upload File', color: 'bg-green-500 hover:bg-green-600' },
    { icon: Download, label: 'Export Data', color: 'bg-purple-500 hover:bg-purple-600' },
    { icon: Send, label: 'Send Report', color: 'bg-orange-500 hover:bg-orange-600' },
    { icon: Edit, label: 'Edit Profile', color: 'bg-gray-500 hover:bg-gray-600' },
    { icon: Trash2, label: 'Clean Up', color: 'bg-red-500 hover:bg-red-600' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className={`flex items-center space-x-2 p-3 rounded-lg text-white transition-colors duration-200 ${action.color}`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;