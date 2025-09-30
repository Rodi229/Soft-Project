import React from 'react';
import { 
  Home, 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Settings, 
  FileText,
  Bell,
  HelpCircle,
  ChevronLeft,
  Menu
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: Users, label: 'Users', active: false },
    { icon: ShoppingCart, label: 'Orders', active: false },
    { icon: FileText, label: 'Reports', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  const bottomItems = [
    { icon: Bell, label: 'Notifications' },
    { icon: HelpCircle, label: 'Help & Support' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-30 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-800">AdminHub</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index}>
                <a
                  href="#"
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                    item.active 
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200">
        <ul className="space-y-2">
          {bottomItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index}>
                <a
                  href="#"
                  className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;