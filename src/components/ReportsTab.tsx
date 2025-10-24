import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, Printer, Download, FileText, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { exportStatsToCSV, exportStatsToPDF, printStats, StatsData } from '../utils/exportUtils';
import { getAvailableYears, getStatisticsByYear, getBarangayStatisticsByYear, getStatusStatisticsByYear, getGenderStatisticsByYear } from '../utils/dataService';

interface ReportsTabProps {
  activeProgram: 'GIP' | 'TUPAD';
}

const ReportsTab: React.FC<ReportsTabProps> = ({ activeProgram }) => {
  const [selectedReportType, setSelectedReportType] = useState('summary');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [barangayStats, setBarangayStats] = useState<any[]>([]);
  const [statusStats, setStatusStats] = useState<any[]>([]);
  const [genderStats, setGenderStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const years = getAvailableYears(activeProgram);
    setAvailableYears(years);
    loadData();
  }, [activeProgram, selectedYear]);

  const loadData = () => {
    setIsLoading(true);
    const stats = getStatisticsByYear(activeProgram, selectedYear);
    const barangay = getBarangayStatisticsByYear(activeProgram, selectedYear);
    const status = getStatusStatisticsByYear(activeProgram, selectedYear);
    const gender = getGenderStatisticsByYear(activeProgram, selectedYear);

    setStatistics(stats);
    setBarangayStats(barangay);
    setStatusStats(status);
    setGenderStats(gender);
    setIsLoading(false);
  };
  
  const primaryColor = activeProgram === 'GIP' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';
  const programName = activeProgram === 'GIP' ? 'GIP' : 'TUPAD';

  // Convert statistics to StatsData format for export functions
  const statsData: StatsData = {
    totalApplicants: statistics.totalApplicants,
    pending: statistics.pending,
    approved: statistics.approved,
    deployed: statistics.deployed,
    completed: statistics.completed,
    rejected: statistics.rejected,
    resigned: statistics.resigned,
    barangaysCovered: statistics.barangaysCovered,
    maleCount: statistics.maleCount,
    femaleCount: statistics.femaleCount
  };

  const handlePrint = () => {
    printStats(statsData, activeProgram);
  };

  const handleExportCSV = () => {
    exportStatsToCSV(statsData, activeProgram);
  };

  const handleExportPDF = () => {
    exportStatsToPDF(statsData, activeProgram);
  };

  const reportTypes = [
    { id: 'summary', label: 'Summary Report', icon: BarChart3, color: 'border-blue-500 bg-blue-50 text-blue-600' },
    { id: 'barangay', label: 'By Barangay', icon: PieChart, color: 'border-green-500 bg-green-50 text-green-600' },
    { id: 'status', label: 'By Status', icon: BarChart3, color: 'border-purple-500 bg-purple-50 text-purple-600' },
    { id: 'gender', label: 'By Gender', icon: PieChart, color: 'border-pink-500 bg-pink-50 text-pink-600' },
  ];

  const summaryData = statistics ? [
    { label: 'Total Applicants', value: statistics.totalApplicants.toString(), male: statistics.maleCount.toString(), female: statistics.femaleCount.toString(), color: 'text-blue-600' },
    { label: 'Approved', value: statistics.approved.toString(), male: statistics.approvedMale.toString(), female: statistics.approvedFemale.toString(), color: 'text-green-600' },
    { label: 'Deployed', value: statistics.deployed.toString(), male: statistics.deployedMale.toString(), female: statistics.deployedFemale.toString(), color: 'text-orange-600' },
    { label: 'Completed', value: statistics.completed.toString(), male: statistics.completedMale.toString(), female: statistics.completedFemale.toString(), color: 'text-purple-600' },
  ] : [];

  // Reset pagination when report type changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedReportType]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{programName} REPORTS</h1>
            <p className="text-gray-600">Generate and view comprehensive reports</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderReportContent = () => {
    switch (selectedReportType) {
      case 'barangay':
        const totalBarangayEntries = barangayStats.length;
        const totalBarangayPages = Math.ceil(totalBarangayEntries / entriesPerPage);
        const startBarangayIndex = (currentPage - 1) * entriesPerPage;
        const endBarangayIndex = startBarangayIndex + entriesPerPage;
        const currentBarangayEntries = barangayStats.slice(startBarangayIndex, endBarangayIndex);
        
        return (
          <div className="space-y-4">
            {/* Entries per page selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>
            </div>

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
                    {currentBarangayEntries.map((barangay, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{barangay.barangay}</td>
                        <td className="py-3 px-4 text-center">{barangay.total}</td>
                        <td className="py-3 px-4 text-center">{barangay.male}</td>
                        <td className="py-3 px-4 text-center">{barangay.female}</td>
                        <td className="py-3 px-4 text-center">{barangay.pending}</td>
                        <td className="py-3 px-4 text-center">{barangay.approved}</td>
                        <td className="py-3 px-4 text-center">{barangay.deployed}</td>
                        <td className="py-3 px-4 text-center">{barangay.completed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalBarangayPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                
                {Array.from({ length: totalBarangayPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-transparent'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalBarangayPages))}
                  disabled={currentPage === totalBarangayPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );

      case 'status':
        const totalStatusEntries = statusStats.length;
        const totalStatusPages = Math.ceil(totalStatusEntries / entriesPerPage);
        const startStatusIndex = (currentPage - 1) * entriesPerPage;
        const endStatusIndex = startStatusIndex + entriesPerPage;
        const currentStatusEntries = statusStats.slice(startStatusIndex, endStatusIndex);
        
        return (
          <div className="space-y-4">
            {/* Entries per page selector */}
            <div className="flex items-center justify-between">
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                {programName} APPLICANTS BY STATUS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentStatusEntries.map((status, index) => (
                  <div key={index} className="text-center p-6 rounded-lg bg-gray-50 border">
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${status.color}`}>
                      {status.status}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {status.total}
                    </div>
                    <div className="text-sm text-gray-600">
                      Applicants
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalStatusPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalStatusPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-transparent'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalStatusPages))}
                  disabled={currentPage === totalStatusPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );

      case 'gender':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {programName} APPLICANTS BY GENDER
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {genderStats.map((genderData, genderIndex) => (
                <div key={genderIndex} className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-center mb-6 text-gray-800">
                    {genderData.gender} ({genderData.total})
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        PENDING
                      </span>
                      <span className="text-lg font-semibold text-gray-900">{genderData.pending}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        APPROVED
                      </span>
                      <span className="text-lg font-semibold text-gray-900">{genderData.approved}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        DEPLOYED
                      </span>
                      <span className="text-lg font-semibold text-gray-900">{genderData.deployed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                        COMPLETED
                      </span>
                      <span className="text-lg font-semibold text-gray-900">{genderData.completed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        REJECTED
                      </span>
                      <span className="text-lg font-semibold text-gray-900">{genderData.rejected}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        RESIGNED
                      </span>
                      <span className="text-lg font-semibold text-gray-900">{genderData.resigned}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        const totalSummaryEntries = summaryData.length;
        const totalSummaryPages = Math.ceil(totalSummaryEntries / entriesPerPage);
        const startSummaryIndex = (currentPage - 1) * entriesPerPage;
        const endSummaryIndex = startSummaryIndex + entriesPerPage;
        const currentSummaryEntries = summaryData.slice(startSummaryIndex, endSummaryIndex);
        
        return (
          <div className="space-y-4">
            {/* Entries per page selector */}
            <div className="flex items-center justify-between">
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                {programName} SUMMARY REPORT
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentSummaryEntries.map((item, index) => (
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

            {/* Pagination */}
            {totalSummaryPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalSummaryPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-transparent'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalSummaryPages))}
                  disabled={currentPage === totalSummaryPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
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
        <div className="flex space-x-2 items-center">
          {/* Year Filter */}
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : undefined)}
              className="text-sm border-0 focus:ring-0 bg-transparent cursor-pointer"
            >
              <option value="">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
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