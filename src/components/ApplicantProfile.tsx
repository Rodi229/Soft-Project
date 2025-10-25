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
      ['Telephone No.:', ''],
      ['Mobile Number:', applicant.contactNumber],
      ['E-mail Address:', applicant.email || ''],
      [''],
      ['3. PLACE OF BIRTH (city/province)', ''],
      [''],
      ['4. DATE OF BIRTH (mm/dd/yyyy)', applicant.birthDate],
      [''],
      ['5. GENDER', applicant.gender === 'MALE' ? 'Male' : 'Female'],
      [''],
      ['6. CIVIL STATUS', applicant.civilStatus || ''],
      [''],
      ['7. EDUCATIONAL ATTAINMENT'],
      ['NAME OF SCHOOL', 'INCLUSIVE DATES', 'DEGREE OR DIPLOMA'],
      ['', 'From', 'To', ''],
      [applicant.school || '', '', '', applicant.educationalAttainment],
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
      { wch: 20 }
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Application Form');

    const fileName = `${applicant.code}_${applicant.lastName}_${applicant.firstName}_Application.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-red-700 text-white px-6 py-4 flex items-center justify-between rounded-t-lg sticky top-0 z-10">
          <h2 className="text-xl font-bold">APPLICANT PROFILE</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportToExcel}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Export to Excel</span>
            </button>
            <button onClick={onClose} className="hover:bg-red-800 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="border-2 border-gray-800 p-6">
            <div className="text-center mb-6">
              <h3 className="font-bold text-lg">DOLE REGIONAL OFFICE ____</h3>
              <h4 className="font-bold">GOVERNMENT INTERNSHIP PROGRAM (GIP)</h4>
              <h4 className="font-bold">APPLICATION FORM</h4>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold mb-2">INSTRUCTION TO APPLICANTS:</p>
              <p className="text-xs mb-4">
                Please fill-out all the required information in this form and attach additional documents, where necessary.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-semibold text-sm mb-2">1. NAME OF APPLICANT:</p>
                <div className="grid grid-cols-3 gap-4 border border-gray-600 p-3">
                  <div>
                    <p className="text-xs text-gray-600">Family Name</p>
                    <p className="font-medium">{applicant.lastName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">First Name</p>
                    <p className="font-medium">{applicant.firstName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Middle Name</p>
                    <p className="font-medium">{applicant.middleName || ''}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm mb-2">2. RESIDENTIAL ADDRESS:</p>
                <div className="border border-gray-600 p-3">
                  <p>{applicant.barangay}</p>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-600">Telephone No.:</p>
                      <p>-</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Mobile Number:</p>
                      <p>{applicant.contactNumber}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-600">E-mail Address:</p>
                    <p>{applicant.email || '-'}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm mb-2">3. PLACE OF BIRTH (city/province)</p>
                <div className="border border-gray-600 p-3">
                  <p>-</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm mb-2">4. DATE OF BIRTH (mm/dd/yyyy)</p>
                <div className="border border-gray-600 p-3">
                  <p>{applicant.birthDate}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm mb-2">5. GENDER</p>
                <div className="border border-gray-600 p-3">
                  <p>{applicant.gender === 'MALE' ? 'Male' : 'Female'}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm mb-2">6. CIVIL STATUS</p>
                <div className="border border-gray-600 p-3">
                  <p>{applicant.civilStatus || '-'}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm mb-2">7. EDUCATIONAL ATTAINMENT</p>
                <div className="border border-gray-600">
                  <div className="grid grid-cols-4 gap-4 p-3 bg-gray-100 font-semibold text-sm">
                    <div>NAME OF SCHOOL</div>
                    <div className="col-span-2 text-center">INCLUSIVE DATES</div>
                    <div>DEGREE OR DIPLOMA</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-3 border-t border-gray-600">
                    <div>{applicant.school || '-'}</div>
                    <div className="text-center text-xs text-gray-600">From</div>
                    <div className="text-center text-xs text-gray-600">To</div>
                    <div>{applicant.educationalAttainment}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-3 border-t border-gray-600">
                    <div>-</div>
                    <div>-</div>
                    <div>-</div>
                    <div>-</div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-gray-800 pt-4 mt-6">
                <p className="text-xs mb-4">
                  <span className="font-semibold">CERTIFICATION:</span> I certify that all information given in this application are complete and accurate to the best of my knowledge. I
                  acknowledge that I have completely read and understood the DOLE-GIP Guidelines as embodied in Administrative Order No. ___,
                  Series of 2013.
                </p>
                <div className="grid grid-cols-2 gap-4 border border-gray-600 p-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-2">DATE</p>
                    <p>{applicant.dateSubmitted}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-2">SIGNATURE OF APPLICANT</p>
                    <p>-</p>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-gray-800 pt-4 mt-6">
                <p className="text-center font-semibold mb-4">FOR DOLE-RO/FO Use only</p>
                <p className="text-sm mb-3">Interviewed and validated by:</p>
                <div className="border border-gray-600 p-3 mb-4 h-16"></div>
                <div className="grid grid-cols-2 gap-4 border border-gray-600 p-3">
                  <div>
                    <p className="text-xs text-gray-600">NAME and SIGNATURE/Position</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">DATE</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-2">Documents Received:</p>
                  <div className="space-y-1 text-sm">
                    <p>☐ Transcript of Records</p>
                    <p>☐ Barangay Certification</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-2">Endorsed by:</p>
                  <div className="border-b border-gray-800 pb-8 mb-2"></div>
                  <p className="text-xs text-center">District/Partylist Representative, where applicable</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-right text-xs text-gray-500">
              <p>Application Code: {applicant.code}</p>
              <p>Status: {applicant.status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;
