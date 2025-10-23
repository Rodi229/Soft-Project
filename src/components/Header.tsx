import React from 'react';
import { User as UserIcon, LogOut } from 'lucide-react';
import { User } from '../utils/auth';

interface HeaderProps {
  activeProgram: 'GIP' | 'TUPAD';
  onProgramChange: (program: 'GIP' | 'TUPAD') => void;
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeProgram, onProgramChange, user, onLogout }) => {
  const toggleProgram = () => {
    onProgramChange(activeProgram === 'GIP' ? 'TUPAD' : 'GIP');
  };

  const headerColor = activeProgram === 'GIP' ? 'bg-red-700' : 'bg-green-700';

  return (
    <header className={`${headerColor} text-white border-b-4 border-yellow-400`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-400 text-black px-3 py-2 rounded font-bold text-lg flex items-center justify-center">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SOFT PROJECTS MANAGEMENT SYSTEM</h1>
              <p className="text-sm opacity-90">City Government of Santa Rosa - Office of the City Mayor</p>
            </div>
          </div>

          {/* Right side - Toggle and User Info */}
          <div className="flex items-center space-x-6">
            {/* Toggle Switch */}
            <div className="flex items-center space-x-3 bg-black bg-opacity-20 px-4 py-2 rounded-lg">
              <button
                onClick={toggleProgram}
                className={`text-sm font-medium transition-colors duration-200 ${
                  activeProgram === 'GIP' ? 'text-white' : 'text-white opacity-60 hover:opacity-80'
                }`}
              >
                GIP
              </button>
              
              <div className="relative">
                <button
                  onClick={toggleProgram}
                  className="relative w-8 h-4 bg-white bg-opacity-30 rounded-full transition-colors duration-200 focus:outline-2 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  <div
                    className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 flex items-center justify-center shadow-sm ${
                      activeProgram === 'GIP' ? 'translate-x-0.5' : 'translate-x-4'
                    }`}
                  >
                    <div className={`w-1 h-1 rounded-full ${activeProgram === 'GIP' ? 'bg-red-800' : 'bg-green-800'}`} />
                  </div>
                </button>
              </div>
              
              <button
                onClick={toggleProgram}
                className={`text-sm font-medium transition-colors duration-200 ${
                  activeProgram === 'TUPAD' ? 'text-white' : 'text-white opacity-60 hover:opacity-80'
                }`}
              >
                TUPAD
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium">Welcome, {user?.name || 'User'}</p>
                <p className="text-xs opacity-75 capitalize">{user?.role || 'user'}</p>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors duration-200 group"
                title="Logout"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
