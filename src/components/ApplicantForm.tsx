import React from "react";
import { X } from "lucide-react";
import { Applicant, calculateAge } from "../utils/dataService.ts";
import Swal from "sweetalert2";

interface ApplicantFormProps {
  showModal: boolean;
  editingApplicant: Applicant | null;
  applicantCode: string;
  formData: any;
  isSubmitting: boolean;
  activeProgram: 'GIP' | 'TUPAD';
  onClose: () => void;
  onInputChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const downloadResume = (fileName: string, fileData: string) => {
  const link = document.createElement('a');
  link.href = fileData;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ApplicantForm: React.FC<ApplicantFormProps> = ({
  showModal,
  editingApplicant,
  applicantCode,
  formData,
  isSubmitting,
  activeProgram,
  onClose,
  onInputChange,
  onSubmit
}) => {
  if (!showModal) return null;

  const headerDarkBgColor = activeProgram === 'GIP' ? 'bg-red-700' : 'bg-green-700';
  const primaryColor = activeProgram === 'GIP' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';
  const programName = activeProgram === 'GIP' ? 'GIP' : 'TUPAD';

  const handleCancel = async () => {
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
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${headerDarkBgColor} text-white px-6 py-4 flex items-center justify-between rounded-t-lg`}>
          <h2 className="text-xl font-bold">
            {editingApplicant ? 'EDIT' : 'ADD NEW'} {programName} APPLICANT
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1 uppercase">Applicant Code</label>
            <input
              type="text"
              value={applicantCode}
              readOnly
              className="w-full border rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 uppercase">First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 uppercase"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 uppercase">Middle Name</label>
            <input
              type="text"
              value={formData.middleName}
              onChange={(e) => onInputChange('middleName', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 uppercase"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 uppercase">Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 uppercase"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 uppercase">Suffix</label>
            <input
              type="text"
              value={formData.extensionName}
              onChange={(e) => onInputChange('extensionName', e.target.value)}
              placeholder="JR, SR, III, etc."
              className="w-full border rounded-lg px-3 py-2 uppercase"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 uppercase">Birth Date * (YYYY/MM/DD)</label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => {
                const birthDate = e.target.value;
                onInputChange('birthDate', birthDate);
                const calculatedAge = calculateAge(birthDate);
                onInputChange('age', String(calculatedAge));
              }}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 uppercase">Age</label>
            <input
              type="number"
              value={formData.age || ''}
              readOnly
              className="w-full border rounded-lg px-3 py-2 bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              {activeProgram === 'GIP' ? 'Must be 18–29 years old' : 'Must be 25-58 years old'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 uppercase">Barangay *</label>
            <select
              value={formData.barangay}
              onChange={(e) => onInputChange('barangay', e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">SELECT BARANGAY</option>
              <option>APLAYA</option>
              <option>BALIBAGO</option>
              <option>CAINGIN</option>
              <option>DITA</option>
              <option>DILA</option>
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
            <label className="block text-sm font-bold mb-1 uppercase">Contact Number *</label>
            <input
              type="text"
              value={formData.contactNumber}
              onChange={(e) => {
                let value = e.target.value.replace(/[^0-9]/g, '');

                if (value.length > 11) {
                  value = value.slice(0, 11);
                }

                if (value.length > 0) {
                  let formatted = value;
                  if (value.length > 4) {
                    formatted = value.slice(0, 4) + '-' + value.slice(4);
                  }
                  if (value.length > 7) {
                    formatted = value.slice(0, 4) + '-' + value.slice(4, 7) + '-' + value.slice(7);
                  }
                  onInputChange('contactNumber', formatted);
                } else {
                  onInputChange('contactNumber', value);
                }
              }}
              pattern="09[0-9]{2}-[0-9]{3}-[0-9]{4}"
              title="Contact number must start with 09 and follow format: 09XX-XXX-XXXX"
              required
              maxLength={13}
              placeholder="09XX-XXX-XXXX"
              className="w-full border rounded-lg px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">Format: 09XX-XXX-XXXX</p>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-bold mb-1 uppercase">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              required
              placeholder="example@email.com"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* School Field */}
          <div>
            <label className="block text-sm font-bold mb-1 uppercase">School</label>
            <input
              type="text"
              value={formData.school}
              onChange={(e) => onInputChange('school', e.target.value)}
              placeholder="Enter school name"
              className="w-full border rounded-lg px-3 py-2 uppercase"
              style={{ textTransform: 'uppercase' }}
            />
          </div>


          <div>
            <label className="block text-sm font-bold mb-1 uppercase">Gender *</label>
            <select
              value={formData.gender}
              onChange={(e) => onInputChange('gender', e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>
          </div>

          {activeProgram === 'TUPAD' && (
            <>
              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Type of ID Submitted *</label>
                <select
                  value={formData.idType}
                  onChange={(e) => onInputChange('idType', e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">SELECT ID TYPE</option>
                  <option>PHILSYS ID</option>
                  <option>DRIVER'S LICENSE</option>
                  <option>SSS ID</option>
                  <option>UMID</option>
                  <option>PASSPORT</option>
                  <option>VOTER'S ID</option>
                  <option>POSTAL ID</option>
                  <option>PRC ID</option>
                  <option>SENIOR CITIZEN ID</option>
                  <option>PWD ID</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 uppercase">ID Number</label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => onInputChange('idNumber', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 uppercase"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Occupation</label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => onInputChange('occupation', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 uppercase"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Civil Status</label>
                <select
                  value={formData.civilStatus}
                  onChange={(e) => onInputChange('civilStatus', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">SELECT CIVIL STATUS</option>
                  <option>SINGLE</option>
                  <option>MARRIED</option>
                  <option>WIDOWED</option>
                  <option>SEPARATED</option>
                  <option>DIVORCED</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Average Monthly Income</label>
                <input
                  type="text"
                  value={formData.averageMonthlyIncome}
                  onChange={(e) => onInputChange('averageMonthlyIncome', e.target.value)}
                  placeholder="₱"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Dependent Name</label>
                <input
                  type="text"
                  value={formData.dependentName}
                  onChange={(e) => onInputChange('dependentName', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 uppercase"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Relationship to Dependent</label>
                <input
                  type="text"
                  value={formData.relationshipToDependent}
                  onChange={(e) => onInputChange('relationshipToDependent', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 uppercase"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
            </>
          )}

          {activeProgram === 'GIP' && (
            <>
              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Educational Attainment *</label>
                <select
                  value={formData.educationalAttainment}
                  onChange={(e) => onInputChange('educationalAttainment', e.target.value)}
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

              <div>
                <label className="block text-sm font-bold mb-1 uppercase">Beneficiary Name</label>
                <input
                  type="text"
                  value={formData.beneficiaryName}
                  onChange={(e) => onInputChange('beneficiaryName', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 uppercase"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
            </>
          )}

         <div>
  <label className="block text-sm font-bold mb-1 uppercase">Upload Resume</label>

    <div className="flex items-center gap-3 border rounded-lg px-3 py-2 bg-white">
      <label className="cursor-pointer shrink-0">
        <span className="bg-yellow-400 px-3 py-1 rounded-md font-medium hover:bg-yellow-500 transition whitespace-nowrap">
          Choose File
        </span>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onInputChange('resumeFile', file);
              onInputChange('resumeFileName', file.name);
            } else {
              onInputChange('resumeFile', null);
              onInputChange('resumeFileName', '');
            }
          }}
        />
      </label>

      {(formData.resumeFileName || editingApplicant?.resumeFileName) ? (
        <button
          type="button"
          onClick={() => {
            const fileName = formData.resumeFileName || editingApplicant?.resumeFileName;
            const fileData = formData.resumeFileData || editingApplicant?.resumeFileData;
            if (fileName && fileData) {
              downloadResume(fileName, fileData);
            }
          }}
          className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium truncate max-w-[150px] text-left"
          title={formData.resumeFileName || editingApplicant?.resumeFileName} // tooltip shows full name
        >
          {formData.resumeFileName || editingApplicant?.resumeFileName}
        </button>
      ) : (
        <span className="text-gray-500 text-sm">No file chosen</span>
      )}
    </div>
  </div>

          <div>
            <label className="block text-sm font-bold mb-1 uppercase">Status</label>
            <select
              value={formData.status}
              onChange={(e) => onInputChange('status', e.target.value)}
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

          <div>
            <label className="block text-sm font-bold mb-1 uppercase">Encoder</label>
            <input
              type="text"
              value="ADMIN"
              readOnly
              className="w-full border rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div className="md:col-span-3 flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={handleCancel}
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
  );
};

export default ApplicantForm;
