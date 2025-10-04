import React, { useState } from "react";
import { Search, Plus, Download, FileText, X, Upload, CreditCard as Edit, Trash2 } from "lucide-react";
import { exportApplicantsToCSV, exportApplicantsToPDF, printApplicants } from '../utils/exportUtils';
import { useData } from '../hooks/useData';
import { Applicant, calculateAge } from '../utils/dataService';
import Swal from "sweetalert2";


interface ApplicantsTabProps {
  activeProgram: 'GIP' | 'TUPAD';
}

const ApplicantsTab: React.FC<ApplicantsTabProps> = ({ activeProgram }) => {
  const { statistics, addApplicant, updateApplicant, deleteApplicant, getFilteredApplicants, refreshData } = useData(activeProgram);
  
  const [showModal, setShowModal] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [barangayFilter, setBarangayFilter] = useState('All Barangays');
  const [genderFilter, setGenderFilter] = useState('All Genders');
  const [ageFilter, setAgeFilter] = useState('All Ages');
  const [educationFilter, setEducationFilter] = useState('All Education Levels');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [applicantCode, setApplicantCode] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    extensionName: '',
    birthDate: '',
    barangay: '',
    contactNumber: '',
    gender: 'MALE' as 'MALE' | 'FEMALE',
    educationalAttainment: '',
    beneficiaryName: '',
    status: 'PENDING' as 'PENDING' | 'APPROVED' | 'DEPLOYED' | 'COMPLETED' | 'REJECTED' | 'RESIGNED'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateApplicantCode = () => {
    const existingApplicants = getFilteredApplicants({});
    
    let maxNumber = 0;
    existingApplicants.forEach(applicant => {
      const codeMatch = applicant.code.match(new RegExp(`${activeProgram}-(\\d+)`));
      if (codeMatch) {
        const number = parseInt(codeMatch[1], 10);
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    });
    
    const nextNumber = maxNumber + 1;
    const paddedNumber = nextNumber.toString().padStart(6, '0');
    return `${activeProgram}-${paddedNumber}`;
  };

  const openModal = () => {
    setEditingApplicant(null);
    setApplicantCode(generateApplicantCode());
    setShowModal(true);
  };

  const openEditModal = (applicant: Applicant) => {
    setEditingApplicant(applicant);
    setApplicantCode(applicant.code);
    setFormData({
      firstName: applicant.firstName,
      middleName: applicant.middleName || '',
      lastName: applicant.lastName,
      extensionName: applicant.extensionName || '',
      birthDate: applicant.birthDate,
      barangay: applicant.barangay,
      contactNumber: applicant.contactNumber,
      gender: applicant.gender,
      educationalAttainment: applicant.educationalAttainment,
      beneficiaryName: applicant.beneficiaryName || '',
      status: applicant.status
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingApplicant(null);
    setApplicantCode('');
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      extensionName: '',
      birthDate: '',
      barangay: '',
      contactNumber: '',
      gender: 'MALE',
      educationalAttainment: '',
      beneficiaryName: '',
      status: 'PENDING'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.birthDate || !formData.barangay || !formData.contactNumber || !formData.educationalAttainment) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const age = calculateAge(formData.birthDate);
      
      if (activeProgram === 'GIP' && (age < 18 || age > 29)) {
        alert('GIP applicants must be between 18-29 years old');
        setIsSubmitting(false);
        return;
      }
      
      if (activeProgram === 'TUPAD' && age < 18) {
        alert('TUPAD applicants must be 18 years old or above');
        setIsSubmitting(false);
        return;
      }
      
      if (editingApplicant) {
        // Update existing applicant
        const updatedApplicant: Applicant = {
          ...editingApplicant,
          ...formData,
          age,
          code: applicantCode,
          program: activeProgram
        };
        
      await updateApplicant(updatedApplicant);

      Swal.fire({
        icon: "success",
        title: "Applicant Updated!",
        text: "The applicant information has been successfully updated.",
        confirmButtonColor: "#3085d6",
        customClass: {
          popup: "rounded-2xl shadow-lg",
          confirmButton: "px-5 py-2 rounded-lg text-white font-semibold",
        },
      });
      } else {
        // Add new applicant
        const applicantData: Omit<Applicant, 'id' | 'dateSubmitted'> = {
          ...formData,
          code: applicantCode,
          age,
          encoder: 'Administrator',
          program: activeProgram
        };
        
        await addApplicant(applicantData);
        alert('Applicant added successfully!');
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving applicant:', error);
      alert('Error saving applicant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (applicantId: string, applicantName: string) => {
    if (confirm(`Are you sure you want to delete ${applicantName}? This action cannot be undone.`)) {
      try {
        await deleteApplicant(applicantId);
        alert('Applicant deleted successfully!');
      } catch (error) {
        console.error('Error deleting applicant:', error);
        alert('Error deleting applicant. Please try again.');
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredApplicants = getFilteredApplicants({
    searchTerm,
    status: statusFilter,
    barangay: barangayFilter,
    gender: genderFilter,
    ageRange: ageFilter,
    education: educationFilter
  });

  // Pagination logic
  const totalEntries = filteredApplicants.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentEntries = filteredApplicants.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, barangayFilter, genderFilter, ageFilter, educationFilter]);

  const handleExportCSV = () => {
    const exportData = filteredApplicants.map(applicant => ({
      code: applicant.code,
      name: `${applicant.firstName} ${applicant.middleName || ''} ${applicant.lastName} ${applicant.extensionName || ''}`.trim(),
      age: applicant.age,
      barangay: applicant.barangay,
      gender: applicant.gender,
      status: applicant.status,
      dateSubmitted: applicant.dateSubmitted
    }));
    exportApplicantsToCSV(exportData, activeProgram);
  };

  const handleExportPDF = () => {
    const exportData = filteredApplicants.map(applicant => ({
      code: applicant.code,
      name: `${applicant.firstName} ${applicant.middleName || ''} ${applicant.lastName} ${applicant.extensionName || ''}`.trim(),
      age: applicant.age,
      barangay: applicant.barangay,
      gender: applicant.gender,
      status: applicant.status,
      dateSubmitted: applicant.dateSubmitted
    }));
    exportApplicantsToPDF(exportData, activeProgram);
  };

  const handlePrint = () => {
    const exportData = filteredApplicants.map(applicant => ({
      code: applicant.code,
      name: `${applicant.firstName} ${applicant.middleName || ''} ${applicant.lastName} ${applicant.extensionName || ''}`.trim(),
      age: applicant.age,
      barangay: applicant.barangay,
      gender: applicant.gender,
      status: applicant.status,
      dateSubmitted: applicant.dateSubmitted
    }));
    printApplicants(exportData, activeProgram);
  };
  
  const primaryColor = activeProgram === 'GIP' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';
  const focusColor = activeProgram === 'GIP' ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-green-500 focus:border-green-500';
  const headerBgColor = activeProgram === 'GIP' ? 'bg-red-600' : 'bg-green-600';
  const headerDarkBgColor = activeProgram === 'GIP' ? 'bg-red-700' : 'bg-green-700';
  const programName = activeProgram === 'GIP' ? 'GIP' : 'TUPAD';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{programName} APPLICANTS</h1>
          <p className="text-gray-600">Total: {statistics.totalApplicants} applicants</p>
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
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
            <option>PENDING</option>
            <option>APPROVED</option>
            <option>DEPLOYED</option>
            <option>COMPLETED</option>
            <option>REJECTED</option>
            <option>RESIGNED</option>
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

          <select 
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor}`}
          >
            <option>All Genders</option>
            <option>MALE</option>
            <option>FEMALE</option>
          </select>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
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

          <div></div>

          <div className="md:col-span-2 flex space-x-2 justify-end">
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
      </div>

      {/* Entries per page and pagination info */}
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
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-600">entries</span>
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, totalEntries)} of {totalEntries} entries
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

        {currentEntries.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-lg mb-2">No applicants found matching your criteria.</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {currentEntries.map((applicant) => (
              <div key={applicant.id} className="grid grid-cols-8 gap-4 px-6 py-4 hover:bg-gray-50">
                <div className="font-medium text-sm">{applicant.code}</div>
                <div className="text-sm">
                  {`${applicant.firstName} ${applicant.middleName || ''} ${applicant.lastName} ${applicant.extensionName || ''}`.trim()}
                </div>
                <div className="text-sm">{applicant.age}</div>
                <div className="text-sm">{applicant.barangay}</div>
                <div className="text-sm">{applicant.gender}</div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    applicant.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    applicant.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                    applicant.status === 'DEPLOYED' ? 'bg-green-100 text-green-800' :
                    applicant.status === 'COMPLETED' ? 'bg-pink-100 text-pink-800' :
                    applicant.status === 'REJECTED' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {applicant.status}
                  </span>
                </div>
                <div className="text-sm">{applicant.dateSubmitted}</div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => openEditModal(applicant)}
                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200"
                    title="Edit applicant"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(applicant.id, `${applicant.firstName} ${applicant.lastName}`)}
                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
                    title="Delete applicant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 text-sm border rounded-md ${
                currentPage === page
                  ? `${headerBgColor} text-white border-transparent`
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
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
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Applicant Code */}
              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Applicant Code</label>
                <input
                  type="text"
                  value={applicantCode}
                  readOnly
                  className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                />
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-bold mb-1 uppercase">First Name *</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required 
                  className="w-full border rounded-lg px-3 py-2" 
                />
              </div>

              {/* Middle Name */}
              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Middle Name</label>
                <input 
                  type="text" 
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2" 
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Last Name *</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required 
                  className="w-full border rounded-lg px-3 py-2" 
                />
              </div>

              {/* Extension Name */}
              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Extension Name</label>
                <input 
                  type="text" 
                  value={formData.extensionName}
                  onChange={(e) => handleInputChange('extensionName', e.target.value)}
                  placeholder="JR, SR, III, etc." 
                  className="w-full border rounded-lg px-3 py-2" 
                />
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Birth Date *</label>
                <input 
                  type="date" 
                  value={formData.birthDate}
                  onChange={(e) => {
                    const birthDate = e.target.value;
                    handleInputChange('birthDate', birthDate);
                    const calculatedAge = calculateAge(birthDate);
                    handleInputChange('age', String(calculatedAge));
                  }}
                  required 
                  className="w-full border rounded-lg px-3 py-2" 
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Age</label>
                <input 
                  type="number" 
                  value={formData.age || ''} 
                  readOnly
                  className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">Must be 18–29 years old</p>
              </div>

              {/* Barangay */}
              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Barangay *</label>
                <select 
                  value={formData.barangay}
                  onChange={(e) => handleInputChange('barangay', e.target.value)}
                  required 
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select Barangay</option>
                  <option>APLAYA</option>
                  <option>BALIBAGO</option>
                  <option>CAINGIN</option>
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

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Contact Number *</label>
                <input 
                  type="text" 
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  required 
                  className="w-full border rounded-lg px-3 py-2" 
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Gender *</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              {/* Educational Attainment */}
              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Educational Attainment *</label>
                <select 
                  value={formData.educationalAttainment}
                  onChange={(e) => handleInputChange('educationalAttainment', e.target.value)}
                  required 
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select</option>
                  <option>JUNIOR HIGH SCHOOL GRADUATE</option>
                  <option>SENIOR HIGH SCHOOL GRADUATE</option>
                  <option>HIGH SCHOOL GRADUATE</option>
                  <option>COLLEGE GRADUATE</option>
                  <option>TECHNICAL/VOCATIONAL COURSE GRADUATE</option>
                  <option>ALS SECONDARY GRADUATE</option>
                  <option>COLLEGE UNDERGRADUATE</option>
                </select>
              </div>

              {/* Beneficiary Name */}
              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Beneficiary Name</label>
                <input 
                  type="text" 
                  value={formData.beneficiaryName}
                  onChange={(e) => handleInputChange('beneficiaryName', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2" 
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Resume Upload (PDF)</label>
                <label className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50">
                  <Upload className="w-4 h-4" />
                  <span>{formData.resume ? formData.resume.name : 'Choose File'}</span>
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    className="hidden" 
                    onChange={(e) => handleInputChange('resume', e.target.files[0])}
                  />
                </label>
              </div>

              {/* Encoder */}
              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Encoder</label>
                <input 
                  type="text" 
                  value={formData.encoder || 'ADMIN'}
                  readOnly
                  className="w-full border rounded-lg px-3 py-2 bg-gray-100" 
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="DEPLOYED">DEPLOYED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="RESIGNED">RESIGNED</option>
                </select>
              </div>

              {/* Cancel + Submit Buttons */}
              <div className="md:col-span-3 flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={async () => {
                    const hasData = Object.values(formData).some(val => val !== '' && val !== null);

                    if (hasData) {
                      const result = await Swal.fire({
                        title: "Discard Changes?",
                        text: "You have unsaved data. Are you sure you want to cancel?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        confirmButtonText: "Yes, cancel it",
                        cancelButtonText: "No, stay",
                        reverseButtons: true,
                        customClass: {
                          popup: "rounded-2xl shadow-lg",
                          confirmButton: "px-4 py-2 rounded-lg",
                          cancelButton: "px-4 py-2 rounded-lg"
                        }
                      });

                      if (result.isConfirmed) {
                        closeModal();
                      }
                    } else {
                      closeModal();
                    }
                  }}
                  className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  Cancel
                </button>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`${primaryColor} text-white px-6 py-2 rounded-lg font-medium transition duration-200`}
                >
                  {isSubmitting ? 'Submitting...' : 'Save Applicant'}
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