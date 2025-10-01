import React from 'react';
import { Search, Plus, Download, FileText } from 'lucide-react';

interface ApplicantsTabProps {
  activeProgram: 'GIP' | 'TUPAD';
}

const ApplicantsTab: React.FC<ApplicantsTabProps> = ({ activeProgram }) => {
  const primaryColor = activeProgram === 'GIP' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';
  const focusColor = activeProgram === 'GIP' ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-green-500 focus:border-green-500';
  const headerBgColor = activeProgram === 'GIP' ? 'bg-red-600' : 'bg-green-600';
  const programName = activeProgram === 'GIP' ? 'GIP' : 'TUPAD';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{programName} APPLICANTS</h1>
          <p className="text-gray-600">Total: 0 applicants</p>
        </div>
        <button className={`${primaryColor} text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200`}>
          <Plus className="w-4 h-4" />
          <span>Add New Applicant</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search applicants..."
              className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor}`}
            />
          </div>

          {/* Status Filter */}
          <select className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor}`}>
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Deployed</option>
            <option>Completed</option>
            <option>Rejected</option>
            <option>Resigned</option>
          </select>

          {/* Barangay Filter */}
          <select className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor}`}>
            <option>All Barangays</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Gender Filter */}
          <select className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor}`}>
            <option>All Genders</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          {/* Age Filter */}
          <select className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor}`}>
            <option>All Ages</option>
            <option>18-25</option>
            <option>26-35</option>
            <option>36-45</option>
            <option>46+</option>
          </select>

          {/* Education Filter */}
          <select className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor}`}>
            <option>All Education Levels</option>
            <option>High School</option>
            <option>College</option>
            <option>Graduate</option>
          </select>
        </div>

        {/* Export Buttons */}
        <div className="flex space-x-2 mt-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
          <button className={`${primaryColor} text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200`}>
            <FileText className="w-4 h-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className={`${headerBgColor} text-white`}>
          <div className="grid grid-cols-8 gap-4 px-6 py-3 text-sm font-medium">
            <div>CODE</div>
            <div>NAME</div>
            <div>AGE</div>
            <div>BARANGAY</div>
            <div>GENDER</div>
            <div>STATUS</div>
            <div>DATE SUBMITTED ↑</div>
            <div>ACTIONS</div>
          </div>
        </div>
        
        <div className="py-16 text-center text-gray-500 bg-gray-50">
          <div className="text-base text-gray-600">No applicants found matching your criteria.</div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsTab;