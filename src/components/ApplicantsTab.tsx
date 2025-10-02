import React, { useState } from "react";
import { Search, Plus, Download, FileText, X, Upload } from "lucide-react";
import { exportApplicantsToCSV, exportApplicantsToPDF, printApplicants, ApplicantData } from '../utils/exportUtils';

interface ApplicantsTabProps {
  activeProgram: 'GIP' | 'TUPAD';
}

const ApplicantsTab: React.FC<ApplicantsTabProps> = ({ activeProgram }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [barangayFilter, setBarangayFilter] = useState('All Barangays');
  const [genderFilter, setGenderFilter] = useState('All Genders');
  const [ageFilter, setAgeFilter] = useState('All Ages');
  const [educationFilter, setEducationFilter] = useState('All Education Levels');

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Applicant submitted");
    setShowModal(false);
  };

  // Mock data for demonstration - in real app, this would come from your backend
  const mockApplicants: ApplicantData[] = [
    // Add some sample data when needed
  ];

  const handleExportCSV = () => {
    exportApplicantsToCSV(mockApplicants, activeProgram);
  };

  const handleExportPDF = () => {
    exportApplicantsToPDF(mockApplicants, activeProgram);
  };

  const handlePrint = () => {
    printApplicants(mockApplicants, activeProgram);
  };
  // Dynamic colors and content based on active program
  const primaryColor = activeProgram === 'GIP' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';
  const focusColor = activeProgram === 'GIP' ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-green-500 focus:border-green-500';
  const headerBgColor = activeProgram === 'GIP' ? 'bg-red-600' : 'bg-green-600';
  const headerDarkBgColor = activeProgram === 'GIP' ? 'bg-red-700' : 'bg-green-700';
  const programName = activeProgram === 'GIP' ? 'GIP' : 'TUPAD';
  const applicantCode = activeProgram === 'GIP' ? 'GIP-000001' : 'TUPAD-000001';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{programName} APPLICANTS</h1>
          <p className="text-gray-600">Total: 0 applicants</p>
        </div>
        <button
          onClick={openModal}
          className={`${primaryColor} text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200`}
        >
          <Plus className="w-4 h-4" />
          <span>Add New Applicant</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search applicants..."
              className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor}`}
            />
          </div>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor}`}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Deployed</option>
            <option>Completed</option>
            <option>Rejected</option>
            <option>Resigned</option>
          </select>

          <select 
            value={barangayFilter}
            onChange={(e) => setBarangayFilter(e.target.value)}
            className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor}`}
          >
            <option>All Barangays</option>
            <option>APLAYA</option>
            <option>BALIBAGO</option>
            <option>CAINGIN</option>
            <option>DILA</option>
            <option>DITA</option>
            <option>DON JOSE</option>
            <option>IBABA</option>
            <option>KANLURAN</option>
            <option>LABAS</option>
            <option>MACABLING</option>
            <option>MALITLIT</option>
            <option>MALUSAK</option>
            <option>MARKET AREA</option>
            <option>POOC</option>
            <option>PULONG SANTA CRUZ</option>
            <option>SANTO DOMINGO</option>
            <option>SINALHAN</option>
            <option>TAGAPO</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <select 
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor}`}
          >
            <option>All Genders</option>
            <option>MALE</option>
            <option>FEMALE</option>
          </select>

          <select 
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor}`}
          >
            <option>All Ages</option>
            <option>18-25</option>
            <option>26-35</option>
            <option>36-45</option>
            <option>46+</option>
          </select>

          <select 
            value={educationFilter}
            onChange={(e) => setEducationFilter(e.target.value)}
            className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor}`}
          >
            <option>All Education Levels</option>
            <option>JUNIOR HIGH SCHOOL GRADUATE</option>
            <option>SENIOR HIGH SCHOOL GRADUATE</option>
            <option>HIGH SCHOOL GRADUATE</option>
            <option>COLLEGE GRADUATE</option>
            <option>TECHNICAL/VOCATIONAL COURSE GRADUATE</option>
            <option>ALS SECONDARY GRADUATE</option>
            <option>COLLEGE UNDERGRADUATE</option>
          </select>
        </div>

        <div className="flex space-x-2 mt-4">
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
          <button 
            onClick={handlePrint}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <FileText className="w-4 h-4" />
            <span>Print</span>
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

        <div className="p-12 text-center text-gray-500">
          <div className="text-lg mb-2">No applicants found matching your criteria.</div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`${headerDarkBgColor} text-white px-6 py-4 flex items-center justify-between rounded-t-lg`}>
              <h2 className="text-xl font-bold">ADD NEW {programName} APPLICANT</h2>
              <button onClick={closeModal}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Applicant Code</label>
                <input
                  type="text"
                  value={applicantCode}
                  readOnly
                  className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <input type="text" required className="w-full border rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Middle Name</label>
                <input type="text" className="w-full border rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Last Name *</label>
                <input type="text" required className="w-full border rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Extension Name</label>
                <input type="text" placeholder="JR, SR, III, etc." className="w-full border rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Birth Date *</label>
                <input type="date" required className="w-full border rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input type="number" placeholder={activeProgram === 'GIP' ? '18-29' : '18+'} className="w-full border rounded-lg px-3 py-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {activeProgram === 'GIP' ? 'Must be 18-29 years old' : 'Must be 18 years old or above'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Barangay *</label>
                <select className="w-full border rounded-lg px-3 py-2" required>
                  <option>Select Barangay</option>
                  <option>APLAYA</option>
                  <option>BALIBAGO</option>
                  <option>CAINGIN</option>
                  <option>DILA</option>
                  <option>DITA</option>
                  <option>DON JOSE</option>
                  <option>IBABA</option>
                  <option>KANLURAN</option>
                  <option>LABAS</option>
                  <option>MACABLING</option>
                  <option>MALITLIT</option>
                  <option>MALUSAK</option>
                  <option>MARKET AREA</option>
                  <option>POOC</option>
                  <option>PULONG SANTA CRUZ</option>
                  <option>SANTO DOMINGO</option>
                  <option>SINALHAN</option>
                  <option>TAGAPO</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Contact Number *</label>
                <input type="text" required className="w-full border rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gender *</label>
                <select className="w-full border rounded-lg px-3 py-2" required>
                  <option>MALE</option>
                  <option>FEMALE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Educational Attainment *</label>
                <select className="w-full border rounded-lg px-3 py-2" required>
                  <option>Select Educational Attainment</option>
                  <option>JUNIOR HIGH SCHOOL GRADUATE</option>
                  <option>SENIOR HIGH SCHOOL GRADUATE</option>
                  <option>HIGH SCHOOL GRADUATE</option>
                  <option>COLLEGE GRADUATE</option>
                  <option>TECHNICAL/VOCATIONAL COURSE GRADUATE</option>
                  <option>ALS SECONDARY GRADUATE</option>
                  <option>COLLEGE UNDERGRADUATE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Beneficiary Name</label>
                <input type="text" className="w-full border rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Resume Upload (PDF)</label>
                <label className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50">
                  <Upload className="w-4 h-4" />
                  <span>Choose File</span>
                  <input type="file" accept="application/pdf" className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Encoder</label>
                <input type="text" value="ADMIN" readOnly className="w-full border rounded-lg px-3 py-2 bg-gray-100" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className="w-full border rounded-lg px-3 py-2">
                  <option>PENDING</option>
                  <option>APPROVED</option>
                  <option>DEPLOYED</option>
                  <option>COMPLETED</option>
                  <option>REJECTED</option>
                  <option>RESIGNED</option>
                </select>
              </div>

              <div className="col-span-2 flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" className={`px-4 py-2 ${primaryColor.replace('hover:', '')} text-white rounded-lg hover:${primaryColor.split(' ')[1]}`}>
                  Save Applicant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsTab;