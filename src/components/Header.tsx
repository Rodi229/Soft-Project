import React from 'react';
import { User, LogOut, ToggleLeft, ToggleRight } from 'lucide-react';

const Header: React.FC = () => {
  const [activeProgram, setActiveProgram] = React.useState<'GIP' | 'TUPAD'>('GIP');

  const toggleProgram = () => {
    setActiveProgram(activeProgram === 'GIP' ? 'TUPAD' : 'GIP');
  };

  return (
    <header className="bg-red-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-400 text-black px-3 py-2 rounded font-bold text-lg">
              {activeProgram}
            </div>
            <div>
              <h1 className="text-xl font-bold">SOFT PROJECTS MANAGEMENT SYSTEM</h1>
              <p className="text-sm opacity-90">City Government of Santa Rosa - Office of the City Mayor</p>
            </div>
          </div>

          {/* Right side - User Info */}
          <div className="flex items-center space-x-4">
            <div className="bg-red-800 px-4 py-2 rounded-lg flex items-center space-x-3">
              <button
                onClick={toggleProgram}
                className={`text-sm font-medium transition-colors duration-200 ${
                  activeProgram === 'GIP' ? 'text-yellow-300' : 'text-white opacity-60 hover:opacity-80'
                }`}
              >
                GIP
              </button>
              
              <button
                onClick={toggleProgram}
                className="relative w-12 h-6 bg-red-900 rounded-full transition-colors duration-200 hover:bg-red-950"
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 flex items-center justify-center ${
                    activeProgram === 'GIP' ? 'translate-x-0.5' : 'translate-x-6'
                  }`}
                >
                  <User className="w-3 h-3 text-red-700" />
                </div>
              </button>
              
              <button
                onClick={toggleProgram}
                className={`text-sm font-medium transition-colors duration-200 ${
                  activeProgram === 'TUPAD' ? 'text-yellow-300' : 'text-white opacity-60 hover:opacity-80'
                }`}
              >
                TUPAD
              </button>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Welcome, ADMIN</p>
              <p className="text-xs opacity-75">Administrator</p>
            </div>
            <LogOut className="w-5 h-5 cursor-pointer hover:opacity-75" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;