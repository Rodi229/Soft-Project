import React, { useState } from 'react';
import { BarChart3, PieChart, Printer, Download, FileText } from 'lucide-react';
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
    { id: 'summary', label: 'Summary Report', icon: BarChart3, color: 'border-blue-500 bg-blue-50 text-blue-600' },
    { id: 'barangay', label: 'By Barangay', icon: PieChart, color: 'border-green-500 bg-green-50 text-green-600' },
    { id: 'status', label: 'By Status', icon: BarChart3, color: 'border-purple-500 bg-purple-50 text-purple-600' },
    { id: 'gender', label: 'By Gender', icon: PieChart, color: 'border-pink-500 bg-pink-50 text-pink-600' },
  ];

  const summaryData = [
    { label: 'Total Applicants', value: '0', male: '0', female: '0', color: 'text-blue-600' },
    { label: 'Approved', value: '0', male: '0', female: '0', color: 'text-green-600' },
    { label: 'Deployed', value: '0', male: '0', female: '0', color: 'text-orange-600' },
    { label: 'Completed', value: '0', male: '0', female: '0', color: 'text-purple-600' },
  ];

  const barangays = [
    'APLAYA', 'BALIBAGO', 'CAINGIN', 'DILA', 'DITA', 'DON JOSE', 'IBABA', 
    'KANLURAN', 'LABAS', 'MACABLING', 'MALITLIT', 'MALUSAK', 'MARKET AREA', 
    'POOC', 'PULONG SANTA CRUZ', 'SANTO DOMINGO', 'SINALHAN', 'TAGAPO'
  ];

  const statusTypes = [
    { name: 'PENDING', color: 'bg-yellow-100 text-yellow-800', count: 0 },
    { name: 'APPROVED', color: 'bg-blue-100 text-blue-800', count: 0 },
    { name: 'DEPLOYED', color: 'bg-green-100 text-green-800', count: 0 },
    { name: 'COMPLETED', color: 'bg-pink-100 text-pink-800', count: 0 },
    { name: 'REJECTED', color: 'bg-orange-100 text-orange-800', count: 0 },
    { name: 'RESIGNED', color: 'bg-gray-100 text-gray-800', count: 0 },
  ];

  const renderReportContent = () => {
    switch (selectedReportType) {
      case 'barangay':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {programName} APPLICANTS BY BARANGAY
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">BARANGAY</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">TOTAL</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">MALE</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">FEMALE</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">PENDING</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">APPROVED</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">DEPLOYED</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">COMPLETED</th>
                  </tr>
                </thead>
                <tbody>
                  {barangays.map((barangay, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{barangay}</td>
                      <td className="py-3 px-4 text-center">0</td>
                      <td className="py-3 px-4 text-center">0</td>
                      <td className="py-3 px-4 text-center">0</td>
                      <td className="py-3 px-4 text-center">0</td>
                      <td className="py-3 px-4 text-center">0</td>
                      <td className="py-3 px-4 text-center">0</td>
                      <td className="py-3 px-4 text-center">0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'status':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {programName} APPLICANTS BY STATUS
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {statusTypes.map((status, index) => (
                <div key={index} className="text-center p-6 rounded-lg bg-gray-50 border">
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${status.color}`}>
                    {status.name}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {status.count}
                  </div>
                  <div className="text-sm text-gray-600">
                    Applicants
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'gender':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {programName} APPLICANTS BY GENDER
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Male Column */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-xl font-bold text-center mb-6 text-gray-800">
                  MALE (0)
                </h4>
                <div className="space-y-4">
                  {statusTypes.map((status, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                        {status.name}
                      </span>
                      <span className="text-lg font-semibold text-gray-900">0</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Female Column */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-xl font-bold text-center mb-6 text-gray-800">
                  FEMALE (0)
                </h4>
                <div className="space-y-4">
                  {statusTypes.map((status, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                        {status.name}
                      </span>
                      <span className="text-lg font-semibold text-gray-900">0</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {programName} SUMMARY REPORT
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {summaryData.map((item, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">{item.label}</h4>
                  <div className={`text-3xl font-bold mb-2 ${item.color}`}>
                    {item.value}
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <span>♂</span>
                      <span>{item.male}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>♀</span>
                      <span>{item.female}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

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
                      ? type.color.split(' ')[2] // Extract text color class
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
      {renderReportContent()}
    </div>
  );
};

export default ReportsTab;