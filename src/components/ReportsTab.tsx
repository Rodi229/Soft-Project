import React, { useState } from 'react';
import { BarChart3, PieChart, Printer, Download, FileText, Users } from 'lucide-react';
import { exportStatsToCSV, exportStatsToPDF, printStats, StatsData } from '../utils/exportUtils';

interface ReportsTabProps {
  activeProgram: 'GIP' | 'TUPAD';
}

const ReportsTab: React.FC<ReportsTabProps> = ({ activeProgram }) => {
  const [selectedReportType, setSelectedReportType] = useState('summary');
  
  const primaryColor = activeProgram === 'GIP' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';
  const programName = activeProgram === 'GIP' ? 'GIP' : 'TUPAD';

  // Mock stats data - in real app, this would come from your backend
  const mockStats: StatsData = {
    totalApplicants: 0,
    pending: 0,
    approved: 0,
    deployed: 0,
    completed: 0,
    rejected: 0,
    resigned: 0,
    barangaysCovered: 0,
    maleCount: 0,
    femaleCount: 0
  };

  const handlePrint = () => {
    printStats(mockStats, activeProgram);
  };

  const handleExportCSV = () => {
    exportStatsToCSV(mockStats, activeProgram);
  };

  const handleExportPDF = () => {
    exportStatsToPDF(mockStats, activeProgram);
  };
  const reportTypes = [
    { id: 'summary', label: 'Summary Report', icon: BarChart3, color: 'border-blue-500 bg-blue-50' },
    { id: 'barangay', label: 'By Barangay', icon: PieChart, color: 'border-green-500 bg-green-50' },
    { id: 'status', label: 'By Status', icon: BarChart3, color: 'border-purple-500 bg-purple-50' },
    { id: 'gender', label: 'By Gender', icon: PieChart, color: 'border-pink-500 bg-pink-50' },
  ];

  const summaryData = [
    { label: 'Total Applicants', value: '0', male: '0', female: '0', color: 'text-blue-600' },
    { label: 'Approved', value: '0', male: '0', female: '0', color: 'text-green-600' },
    { label: 'Deployed', value: '0', male: '0', female: '0', color: 'text-orange-600' },
    { label: 'Completed', value: '0', male: '0', female: '0', color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{programName} REPORTS</h1>
          <p className="text-gray-600">Generate and view comprehensive reports</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handlePrint}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button 
            onClick={handleExportCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
          <button 
            onClick={handleExportPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <FileText className="w-4 h-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedReportType(type.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedReportType === type.id
                    ? type.color
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Icon className={`w-8 h-8 ${
                    selectedReportType === type.id
                      ? type.color.includes('blue') ? 'text-blue-600' :
                        type.color.includes('green') ? 'text-green-600' :
                        type.color.includes('purple') ? 'text-purple-600' :
                        'text-pink-600'
                      : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    selectedReportType === type.id ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {type.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">{programName} SUMMARY REPORT</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryData.map((item, index) => (
            <div key={index} className="text-center p-4 rounded-lg bg-gray-50">
              <h4 className="text-sm font-medium text-gray-600 mb-2">{item.label}</h4>
              <div className={`text-3xl font-bold mb-2 ${item.color}`}>
                {item.value}
              </div>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{item.male}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{item.female}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;