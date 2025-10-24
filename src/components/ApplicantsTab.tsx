import React, { useState } from "react";
import { Search, Plus, Download, FileText, CreditCard as Edit, Trash2, Archive, ArchiveRestore } from "lucide-react";
import { exportApplicantsToCSV, exportApplicantsToPDF, printApplicants } from '../utils/exportUtils.ts';
import { useData } from '../hooks/useData.ts';
import { Applicant, calculateAge } from "../utils/dataService.ts";
import { handleArchive, handleUnarchive, handleDelete } from '../components/ApplicantActions.tsx';
import ApplicantForm from '../components/ApplicantForm.tsx';
import Swal from "sweetalert2";

interface ApplicantsTabProps {
  activeProgram: 'GIP' | 'TUPAD';
}

const ApplicantsTab: React.FC<ApplicantsTabProps> = ({ activeProgram }) => {
  const {addApplicant, updateApplicant, deleteApplicant, getFilteredApplicants, refreshData } = useData(activeProgram);

  const [showModal, setShowModal] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [barangayFilter, setBarangayFilter] = useState('All Barangays');
  const [genderFilter, setGenderFilter] = useState('All Genders');
  const [ageFilter, setAgeFilter] = useState('All Ages');
  const [educationFilter, setEducationFilter] = useState('All Education Levels');
  const [showArchived, setShowArchived] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [applicantCode, setApplicantCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    extensionName: '',
    birthDate: '',
    age: '',
    barangay: '',
    contactNumber: '',
    gender: 'MALE' as 'MALE' | 'FEMALE',
    educationalAttainment: '',
    beneficiaryName: '',
    status: 'PENDING' as 'PENDING' | 'APPROVED' | 'DEPLOYED' | 'COMPLETED' | 'REJECTED' | 'RESIGNED',
    idType: '',
    idNumber: '',
    occupation: '',
    civilStatus: '',
    averageMonthlyIncome: '',
    dependentName: '',
    relationshipToDependent: ''
  });

  const generateApplicantCode = () => {
    const existingApplicants = getFilteredApplicants({});
    const prefix = activeProgram === 'GIP' ? 'GIP' : 'TPD';

    let maxNumber = 0;
    existingApplicants.forEach(applicant => {
      const codeMatch = applicant.code.match(new RegExp(`${prefix}-(\\d+)`));
      if (codeMatch) {
        const number = parseInt(codeMatch[1], 10);
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    });

    const nextNumber = maxNumber + 1;
    const paddedNumber = nextNumber.toString().padStart(6, '0');
    return `${prefix}-${paddedNumber}`;
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
      age: applicant.age.toString(),
      barangay: applicant.barangay,
      contactNumber: applicant.contactNumber,
      gender: applicant.gender,
      educationalAttainment: applicant.educationalAttainment,
      beneficiaryName: applicant.beneficiaryName || '',
      status: applicant.status,
      idType: applicant.idType || '',
      idNumber: applicant.idNumber || '',
      occupation: applicant.occupation || '',
      civilStatus: applicant.civilStatus || '',
      averageMonthlyIncome: applicant.averageMonthlyIncome || '',
      dependentName: applicant.dependentName || '',
      relationshipToDependent: applicant.relationshipToDependent || ''
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
      age: '',
      barangay: '',
      contactNumber: '',
      gender: 'MALE',
      educationalAttainment: '',
      beneficiaryName: '',
      status: 'PENDING',
      idType: '',
      idNumber: '',
      occupation: '',
      civilStatus: '',
      averageMonthlyIncome: '',
      dependentName: '',
      relationshipToDependent: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.birthDate || !formData.barangay || !formData.contactNumber) {
      await Swal.fire({
        icon: 'error',
        title: 'Missing Required Fields',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'rounded-2xl shadow-lg',
          confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
        }
      });
      return;
    }

    if (activeProgram === 'GIP' && !formData.educationalAttainment) {
      await Swal.fire({
        icon: 'error',
        title: 'Missing Required Fields',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'rounded-2xl shadow-lg',
          confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
        }
      });
      return;
    }

    if (activeProgram === 'TUPAD' && !formData.idType) {
      await Swal.fire({
        icon: 'error',
        title: 'Missing Required Fields',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'rounded-2xl shadow-lg',
          confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
        }
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const age = calculateAge(formData.birthDate);

      if (activeProgram === 'GIP' && (age < 18 || age > 29)) {
        await Swal.fire({
          icon: 'error',
          title: 'Age Requirement Not Met',
          text: 'GIP applicants must be between 18-29 years old',
          confirmButtonColor: '#3085d6',
          customClass: {
            popup: 'rounded-2xl shadow-lg',
            confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
          }
        });
        setIsSubmitting(false);
        return;
      }

      if (activeProgram === 'TUPAD' && (age < 25 || age > 58)) {
        await Swal.fire({
          icon: 'error',
          title: 'Age Requirement Not Met',
          text: 'TUPAD applicants must be between 25-58 years old',
          confirmButtonColor: '#3085d6',
          customClass: {
            popup: 'rounded-2xl shadow-lg',
            confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
          }
        });
        setIsSubmitting(false);
        return;
      }

      if (editingApplicant) {
        const updatedApplicant: Applicant = {
          ...editingApplicant,
          firstName: formData.firstName,
          middleName: formData.middleName || undefined,
          lastName: formData.lastName,
          extensionName: formData.extensionName || undefined,
          birthDate: formData.birthDate,
          age,
          barangay: formData.barangay,
          contactNumber: formData.contactNumber,
          gender: formData.gender,
          educationalAttainment: formData.educationalAttainment || '',
          beneficiaryName: formData.beneficiaryName || undefined,
          code: applicantCode,
          status: formData.status,
          program: activeProgram,
          idType: activeProgram === 'TUPAD' ? formData.idType : undefined,
          idNumber: activeProgram === 'TUPAD' ? formData.idNumber : undefined,
          occupation: activeProgram === 'TUPAD' ? formData.occupation : undefined,
          civilStatus: activeProgram === 'TUPAD' ? formData.civilStatus : undefined,
          averageMonthlyIncome: activeProgram === 'TUPAD' ? formData.averageMonthlyIncome : undefined,
          dependentName: activeProgram === 'TUPAD' ? formData.dependentName : undefined,
          relationshipToDependent: activeProgram === 'TUPAD' ? formData.relationshipToDependent : undefined
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
        const applicantData: Omit<Applicant, 'id' | 'dateSubmitted'> = {
          firstName: formData.firstName,
          middleName: formData.middleName || undefined,
          lastName: formData.lastName,
          extensionName: formData.extensionName || undefined,
          birthDate: formData.birthDate,
          age,
          barangay: formData.barangay,
          contactNumber: formData.contactNumber,
          gender: formData.gender,
          educationalAttainment: formData.educationalAttainment || '',
          beneficiaryName: formData.beneficiaryName || undefined,
          code: applicantCode,
          encoder: 'Administrator',
          status: formData.status,
          program: activeProgram,
          idType: activeProgram === 'TUPAD' ? formData.idType : undefined,
          idNumber: activeProgram === 'TUPAD' ? formData.idNumber : undefined,
          occupation: activeProgram === 'TUPAD' ? formData.occupation : undefined,
          civilStatus: activeProgram === 'TUPAD' ? formData.civilStatus : undefined,
          averageMonthlyIncome: activeProgram === 'TUPAD' ? formData.averageMonthlyIncome : undefined,
          dependentName: activeProgram === 'TUPAD' ? formData.dependentName : undefined,
          relationshipToDependent: activeProgram === 'TUPAD' ? formData.relationshipToDependent : undefined
        };

        await addApplicant(applicantData);
        await Swal.fire({
          icon: 'success',
          title: 'Applicant Added!',
          text: 'The applicant has been successfully added to the system.',
          confirmButtonColor: '#3085d6',
          customClass: {
            popup: 'rounded-2xl shadow-lg',
            confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
          }
        });
      }

      closeModal();
    } catch (error) {
      console.error('Error saving applicant:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error saving applicant. Please try again.',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'rounded-2xl shadow-lg',
          confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const fieldsToCapitalize = [
      'firstName', 'middleName', 'lastName', 'extensionName',
      'barangay', 'idNumber', 'occupation', 'dependentName',
      'relationshipToDependent', 'beneficiaryName'
    ];

    if (fieldsToCapitalize.includes(field) && typeof value === 'string') {
      value = value.toUpperCase();
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredApplicants = getFilteredApplicants({
    searchTerm,
    status: statusFilter,
    barangay: barangayFilter,
    gender: genderFilter,
    ageRange: ageFilter,
    education: educationFilter
  }).filter(applicant => showArchived ? applicant.archived : !applicant.archived);

  const totalEntries = filteredApplicants.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentEntries = filteredApplicants.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, barangayFilter, genderFilter, ageFilter, educationFilter, showArchived]);

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
  const programName = activeProgram === 'GIP' ? 'GIP' : 'TUPAD';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{programName} APPLICANTS{showArchived ? ' - ARCHIVE' : ''}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            {showArchived ? (
              <>
                <ArchiveRestore className="w-4 h-4" />
                <span>View Active</span>
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" />
                <span>Archive</span>
              </>
            )}
          </button>
          {!showArchived && (
            <button
              onClick={openModal}
              className={`${primaryColor} text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200`}
            >
              <Plus className="w-4 h-4" />
              <span>Add New Applicant</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className={`${headerBgColor} text-white`}>
          <div className="grid grid-cols-8 gap-4 px-6 py-3 text-sm font-medium">
            <div>CODE</div>
            <div>NAME</div>
            <div>AGE</div>
            <div>BARANGAY</div>
            <div>GENDER</div>
            <div>STATUS</div>
            <div>DATE SUBMITTED</div>
            <div>ACTIONS</div>
          </div>
        </div>

        {currentEntries.length === 0 ? (
          <div className="p-3 text-center text-gray-500">
            <div className="text-lg mb-2">No applicants found.</div>
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
                  {showArchived ? (
                    <>
                      <button
                        onClick={() => handleUnarchive(applicant.id, `${applicant.firstName} ${applicant.lastName}`, getFilteredApplicants, updateApplicant, refreshData)}
                        className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors duration-200"
                        title="Restore applicant"
                      >
                        <ArchiveRestore className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(applicant.id, `${applicant.firstName} ${applicant.lastName}`, deleteApplicant)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => openEditModal(applicant)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200"
                        title="Edit applicant"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleArchive(applicant.id, `${applicant.firstName} ${applicant.lastName}`, getFilteredApplicants, updateApplicant, refreshData)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
                        title="Delete (Archive)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

      <ApplicantForm
        showModal={showModal}
        editingApplicant={editingApplicant}
        applicantCode={applicantCode}
        formData={formData}
        isSubmitting={isSubmitting}
        activeProgram={activeProgram}
        onClose={closeModal}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ApplicantsTab;
