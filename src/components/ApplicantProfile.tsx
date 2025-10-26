import React from "react";
import { X, Download } from "lucide-react";
import { Applicant } from "../utils/dataService";
import * as XLSX from 'xlsx';

interface ApplicantProfileProps {
  applicant: Applicant;
  onClose: () => void;
}

const ApplicantProfile: React.FC<ApplicantProfileProps> = ({ applicant, onClose }) => {
  const handleExportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    const profileData = [
      ['DOLE REGIONAL OFFICE ____'],
      ['GOVERNMENT INTERNSHIP PROGRAM (GIP)'],
      ['APPLICATION FORM'],
      [''],
      ['INSTRUCTION TO APPLICANTS:'],
      ['Please fill-out all the required information in this form and attach additional documents, where necessary.'],
      [''],
      ['1. NAME OF APPLICANT:'],
      ['Family Name', 'First Name', 'Middle Name'],
      [applicant.lastName, applicant.firstName, applicant.middleName || ''],
      [''],
      ['2. RESIDENTIAL ADDRESS:'],
      [applicant.barangay],
      [''],
      ['Telephone No.:', applicant.telephoneNumber || '-'],
      ['Mobile Number:', applicant.contactNumber],
      ['E-mail Address:', applicant.email || ''],
      [''],
      ['3. PLACE OF BIRTH (city/province)', applicant.placeOfBirth || '-'],
      [''],
      ['4. DATE OF BIRTH (mm/dd/yyyy)', applicant.birthDate],
      [''],
      ['5. GENDER', applicant.gender === 'MALE' ? 'Male' : 'Female'],
      [''],
      ['6. CIVIL STATUS', applicant.civilStatus || '-'],
      [''],
      ['7. EDUCATIONAL ATTAINMENT'],
      ['NAME OF SCHOOL', 'INCLUSIVE DATES', 'DEGREE OR DIPLOMA', 'COURSE'],
      ['', 'From', 'To', '', ''],
      [applicant.school || '', '', '', applicant.educationalAttainment, applicant.course || ''],
      [''],
      [''],
      ['CERTIFICATION: I certify that all information given in this application are complete and accurate to the best of my knowledge. I'],
      ['acknowledge that I have completely read and understood the DOLE-GIP Guidelines as embodied in Administrative Order No. ___,'],
      ['Series of 2013.'],
      [''],
      ['DATE', 'SIGNATURE OF APPLICANT'],
      [applicant.dateSubmitted, ''],
      [''],
      ['FOR DOLE-RO/FO Use only'],
      ['Interviewed and validated by:'],
      [''],
      [''],
      ['NAME and SIGNATURE/Position', 'DATE'],
      [''],
      ['Documents Received:'],
      ['Transcript of Records'],
      ['Barangay Certification'],
      [''],
      ['Endorsed by:'],
      [''],
      ['District/Partylist Representative, where applicable'],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(profileData);

    worksheet['!cols'] = [
      { wch: 30 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 }
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Application Form');

    const fileName = `${applicant.code}_${applicant.lastName}_${applicant.firstName}_Application.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-red-700 to-red-800 text-white px-8 py-5 flex items-center justify-between rounded-t-xl sticky top-0 z-10 shadow-lg">
          <h2 className="text-2xl font-bold tracking-wide">APPLICANT PROFILE</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportToExcel}
              className="bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">Export to Excel</span>
            </button>
            <button onClick={onClose} className="hover:bg-red-900 p-2 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
          <div className="border-4 border-gray-800 rounded-lg p-8 bg-white shadow-xl">
            <div className="flex justify-between items-start mb-8">
              <div className="flex-1">
                <div className="text-center mb-6">
                  <h3 className="font-bold text-xl text-gray-800 mb-1">DOLE REGIONAL OFFICE ____</h3>
                  <h4 className="font-bold text-lg text-red-700">GOVERNMENT INTERNSHIP PROGRAM (GIP)</h4>
                  <h4 className="font-bold text-md text-gray-700">APPLICATION FORM</h4>
                </div>
              </div>
              
              {applicant.photoFileData && (
                <div className="ml-4 flex flex-col items-center">
                  <div className="border-4 border-gray-800 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={applicant.photoFileData}
                      alt="Applicant Photo"
                      className="w-32 h-32 object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2 font-semibold">2x2 PHOTO</p>
                </div>
              )}
            </div>

            <div className="mb-4 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm font-semibold mb-2 text-blue-900">INSTRUCTION TO APPLICANTS:</p>
              <p className="text-xs text-blue-800">
                Please fill-out all the required information in this form and attach additional documents, where necessary.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                <p className="font-semibold text-sm mb-3 text-gray-800">1. NAME OF APPLICANT:</p>
                <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded border-2 border-gray-400 shadow-sm">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Family Name</p>
                    <p className="font-bold text-gray-900">{applicant.lastName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">First Name</p>
                    <p className="font-bold text-gray-900">{applicant.firstName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Middle Name</p>
                    <p className="font-bold text-gray-900">{applicant.middleName || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                <p className="font-semibold text-sm mb-3 text-gray-800">2. RESIDENTIAL ADDRESS:</p>
                <div className="bg-white p-4 rounded border-2 border-gray-400 shadow-sm">
                  <p className="font-medium text-gray-900 mb-3">{applicant.barangay}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">Telephone No.:</p>
                      <p className="font-medium text-gray-900">{applicant.telephoneNumber || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">Mobile Number:</p>
                      <p className="font-medium text-gray-900">{applicant.contactNumber}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 font-semibold mb-1">E-mail Address:</p>
                    <p className="font-medium text-gray-900">{applicant.email || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                <p className="font-semibold text-sm mb-3 text-gray-800">3. PLACE OF BIRTH (city/province)</p>
                <div className="bg-white p-4 rounded border-2 border-gray-400 shadow-sm">
                  <p className="font-medium text-gray-900">{applicant.placeOfBirth || '-'}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                <p className="font-semibold text-sm mb-3 text-gray-800">4. DATE OF BIRTH (mm/dd/yyyy)</p>
                <div className="bg-white p-4 rounded border-2 border-gray-400 shadow-sm">
                  <p className="font-medium text-gray-900">{applicant.birthDate}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                <p className="font-semibold text-sm mb-3 text-gray-800">5. GENDER</p>
                <div className="bg-white p-4 rounded border-2 border-gray-400 shadow-sm">
                  <p className="font-medium text-gray-900">{applicant.gender === 'MALE' ? 'Male' : 'Female'}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                <p className="font-semibold text-sm mb-3 text-gray-800">6. CIVIL STATUS</p>
                <div className="bg-white p-4 rounded border-2 border-gray-400 shadow-sm">
                  <p className="font-medium text-gray-900">{applicant.civilStatus || '-'}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                <p className="font-semibold text-sm mb-3 text-gray-800">7. EDUCATIONAL ATTAINMENT</p>
                <div className="bg-white border-2 border-gray-400 rounded shadow-sm overflow-hidden">
                  <div className="grid grid-cols-5 gap-4 p-4 bg-gray-100 font-semibold text-sm text-gray-800 border-b-2 border-gray-400">
                    <div>NAME OF SCHOOL</div>
                    <div className="col-span-2 text-center">INCLUSIVE DATES</div>
                    <div>DEGREE OR DIPLOMA</div>
                    <div>COURSE</div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-300">
                    <div className="font-medium text-gray-900">{applicant.school || '-'}</div>
                    <div className="text-center text-xs text-gray-600">From: -</div>
                    <div className="text-center text-xs text-gray-600">To: -</div>
                    <div className="font-medium text-gray-900">{applicant.educationalAttainment}</div>
                    <div className="font-medium text-gray-900">{applicant.course || '-'}</div>
                  </div>
                </div>
              </div>

              <div className="border-t-4 border-gray-800 pt-6 mt-8">
                <p className="text-xs mb-4 text-gray-700 leading-relaxed bg-yellow-50 p-4 rounded border border-yellow-200">
                  <span className="font-semibold text-yellow-900">CERTIFICATION:</span> I certify that all information given in this application are complete and accurate to the best of my knowledge. I
                  acknowledge that I have completely read and understood the DOLE-GIP Guidelines as embodied in Administrative Order No. ___,
                  Series of 2013.
                </p>
                <div className="grid grid-cols-2 gap-6 bg-white p-4 rounded border-2 border-gray-400 shadow-sm">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-2">DATE</p>
                    <p className="font-medium text-gray-900">{applicant.dateSubmitted}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-2">SIGNATURE OF APPLICANT</p>
                    <p className="font-medium text-gray-900">-</p>
                  </div>
                </div>
              </div>

              <div className="border-t-4 border-gray-800 pt-6 mt-8 bg-blue-50 p-6 rounded-lg">
                <p className="text-center font-semibold mb-4 text-lg text-blue-900">FOR DOLE-RO/FO Use only</p>
                <p className="text-sm mb-3 font-semibold text-gray-800">Interviewed and validated by:</p>
                <div className="bg-white p-4 rounded border-2 border-gray-400 mb-4 h-20"></div>
                <div className="grid grid-cols-2 gap-6 bg-white p-4 rounded border-2 border-gray-400 mb-4">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">NAME and SIGNATURE/Position</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">DATE</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-2 text-gray-800">Documents Received:</p>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>☐ Transcript of Records</p>
                    <p>☐ Barangay Certification</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-2 text-gray-800">Endorsed by:</p>
                  <div className="border-b-2 border-gray-800 pb-8 mb-2"></div>
                  <p className="text-xs text-center text-gray-600">District/Partylist Representative, where applicable</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg text-right text-xs text-gray-700 border-2 border-gray-300">
              <p className="font-semibold">Application Code: <span className="text-red-700">{applicant.code}</span></p>
              <p className="font-semibold">Status: <span className="text-blue-700">{applicant.status}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;
