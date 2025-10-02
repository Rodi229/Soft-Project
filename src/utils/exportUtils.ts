// Export utilities for CSV, PDF, and Print functionality

export interface ApplicantData {
  code: string;
  name: string;
  age: number;
  barangay: string;
  gender: string;
  status: string;
  dateSubmitted: string;
}

export interface StatsData {
  totalApplicants: number;
  pending: number;
  approved: number;
  deployed: number;
  completed: number;
  rejected: number;
  resigned: number;
  barangaysCovered: number;
  maleCount: number;
  femaleCount: number;
}

// CSV Export Functions
export const exportApplicantsToCSV = (applicants: ApplicantData[], program: 'GIP' | 'TUPAD') => {
  const headers = ['Code', 'Name', 'Age', 'Barangay', 'Gender', 'Status', 'Date Submitted'];
  const csvContent = [
    headers.join(','),
    ...applicants.map(applicant => [
      applicant.code,
      `"${applicant.name}"`,
      applicant.age,
      applicant.barangay,
      applicant.gender,
      applicant.status,
      applicant.dateSubmitted
    ].join(','))
  ].join('\n');

  downloadFile(csvContent, `${program}_Applicants_${getCurrentDate()}.csv`, 'text/csv');
};

export const exportStatsToCSV = (stats: StatsData, program: 'GIP' | 'TUPAD') => {
  const headers = ['Metric', 'Total', 'Male', 'Female'];
  const csvContent = [
    headers.join(','),
    `Total Applicants,${stats.totalApplicants},${stats.maleCount},${stats.femaleCount}`,
    `Pending,${stats.pending},0,0`,
    `Approved,${stats.approved},0,0`,
    `Deployed,${stats.deployed},0,0`,
    `Completed,${stats.completed},0,0`,
    `Rejected,${stats.rejected},0,0`,
    `Resigned,${stats.resigned},0,0`,
    `Barangays Covered,${stats.barangaysCovered},N/A,N/A`
  ].join('\n');

  downloadFile(csvContent, `${program}_Statistics_${getCurrentDate()}.csv`, 'text/csv');
};

// PDF Export Functions
export const exportApplicantsToPDF = (applicants: ApplicantData[], program: 'GIP' | 'TUPAD') => {
  const programName = program === 'GIP' ? 'Government Internship Program' : 'TUPAD Program';
  
  let pdfContent = `
    <html>
      <head>
        <title>${program} Applicants Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: ${program === 'GIP' ? '#dc2626' : '#16a34a'}; margin: 0; }
          .header p { margin: 5px 0; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: ${program === 'GIP' ? '#dc2626' : '#16a34a'}; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${program} APPLICANTS REPORT</h1>
          <p>${programName}</p>
          <p>City Government of Santa Rosa - Office of the City Mayor</p>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Age</th>
              <th>Barangay</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Date Submitted</th>
            </tr>
          </thead>
          <tbody>
  `;

  if (applicants.length === 0) {
    pdfContent += `
            <tr>
              <td colspan="7" style="text-align: center; padding: 20px; color: #666;">
                No applicants found matching your criteria.
              </td>
            </tr>
    `;
  } else {
    applicants.forEach(applicant => {
      pdfContent += `
            <tr>
              <td>${applicant.code}</td>
              <td>${applicant.name}</td>
              <td>${applicant.age}</td>
              <td>${applicant.barangay}</td>
              <td>${applicant.gender}</td>
              <td>${applicant.status}</td>
              <td>${applicant.dateSubmitted}</td>
            </tr>
      `;
    });
  }

  pdfContent += `
          </tbody>
        </table>
        <div class="footer">
          <p>© 2024 City Government of Santa Rosa - Office of the City Mayor</p>
          <p>Total Records: ${applicants.length}</p>
        </div>
      </body>
    </html>
  `;

  printHTML(pdfContent, `${program}_Applicants_${getCurrentDate()}.pdf`);
};

export const exportStatsToPDF = (stats: StatsData, program: 'GIP' | 'TUPAD') => {
  const programName = program === 'GIP' ? 'Government Internship Program' : 'TUPAD Program';
  
  const pdfContent = `
    <html>
      <head>
        <title>${program} Statistics Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: ${program === 'GIP' ? '#dc2626' : '#16a34a'}; margin: 0; }
          .header p { margin: 5px 0; color: #666; }
          .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
          .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; }
          .stat-value { font-size: 24px; font-weight: bold; color: ${program === 'GIP' ? '#dc2626' : '#16a34a'}; }
          .stat-label { font-size: 14px; color: #666; margin-top: 5px; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${program} STATISTICS REPORT</h1>
          <p>${programName}</p>
          <p>City Government of Santa Rosa - Office of the City Mayor</p>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${stats.totalApplicants}</div>
            <div class="stat-label">Total Applicants</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.pending}</div>
            <div class="stat-label">Pending</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.approved}</div>
            <div class="stat-label">Approved</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.deployed}</div>
            <div class="stat-label">Deployed</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.completed}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.rejected}</div>
            <div class="stat-label">Rejected</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.resigned}</div>
            <div class="stat-label">Resigned</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.barangaysCovered}</div>
            <div class="stat-label">Barangays Covered</div>
          </div>
        </div>
        <div class="footer">
          <p>© 2024 City Government of Santa Rosa - Office of the City Mayor</p>
          <p>Report generated with current system data</p>
        </div>
      </body>
    </html>
  `;

  printHTML(pdfContent, `${program}_Statistics_${getCurrentDate()}.pdf`);
};

// Print Functions
export const printApplicants = (applicants: ApplicantData[], program: 'GIP' | 'TUPAD') => {
  const programName = program === 'GIP' ? 'Government Internship Program' : 'TUPAD Program';
  
  let printContent = `
    <html>
      <head>
        <title>Print ${program} Applicants</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: ${program === 'GIP' ? '#dc2626' : '#16a34a'}; margin: 0; }
          .header p { margin: 5px 0; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
          th { background-color: ${program === 'GIP' ? '#dc2626' : '#16a34a'}; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${program} APPLICANTS</h1>
          <p>${programName}</p>
          <p>City Government of Santa Rosa - Office of the City Mayor</p>
          <p>Printed on: ${new Date().toLocaleDateString()}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Age</th>
              <th>Barangay</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Date Submitted</th>
            </tr>
          </thead>
          <tbody>
  `;

  if (applicants.length === 0) {
    printContent += `
            <tr>
              <td colspan="7" style="text-align: center; padding: 20px; color: #666;">
                No applicants found matching your criteria.
              </td>
            </tr>
    `;
  } else {
    applicants.forEach(applicant => {
      printContent += `
            <tr>
              <td>${applicant.code}</td>
              <td>${applicant.name}</td>
              <td>${applicant.age}</td>
              <td>${applicant.barangay}</td>
              <td>${applicant.gender}</td>
              <td>${applicant.status}</td>
              <td>${applicant.dateSubmitted}</td>
            </tr>
      `;
    });
  }

  printContent += `
          </tbody>
        </table>
        <div class="footer">
          <p>© 2024 City Government of Santa Rosa - Office of the City Mayor</p>
          <p>Total Records: ${applicants.length}</p>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
};

export const printStats = (stats: StatsData, program: 'GIP' | 'TUPAD') => {
  const programName = program === 'GIP' ? 'Government Internship Program' : 'TUPAD Program';
  
  const printContent = `
    <html>
      <head>
        <title>Print ${program} Statistics</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: ${program === 'GIP' ? '#dc2626' : '#16a34a'}; margin: 0; }
          .header p { margin: 5px 0; color: #666; }
          .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
          .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; }
          .stat-value { font-size: 24px; font-weight: bold; color: ${program === 'GIP' ? '#dc2626' : '#16a34a'}; }
          .stat-label { font-size: 14px; color: #666; margin-top: 5px; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${program} STATISTICS</h1>
          <p>${programName}</p>
          <p>City Government of Santa Rosa - Office of the City Mayor</p>
          <p>Printed on: ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${stats.totalApplicants}</div>
            <div class="stat-label">Total Applicants</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.pending}</div>
            <div class="stat-label">Pending</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.approved}</div>
            <div class="stat-label">Approved</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.deployed}</div>
            <div class="stat-label">Deployed</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.completed}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.rejected}</div>
            <div class="stat-label">Rejected</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.resigned}</div>
            <div class="stat-label">Resigned</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.barangaysCovered}</div>
            <div class="stat-label">Barangays Covered</div>
          </div>
        </div>
        <div class="footer">
          <p>© 2024 City Government of Santa Rosa - Office of the City Mayor</p>
          <p>Report generated with current system data</p>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
};

// Helper Functions
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const printHTML = (htmlContent: string, filename: string) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
};

const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};