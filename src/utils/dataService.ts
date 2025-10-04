// Data service for managing applicants and statistics
export interface Applicant {
  id: string;
  code: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  extensionName?: string;
  birthDate: string;
  age: number;
  barangay: string;
  contactNumber: string;
  gender: 'MALE' | 'FEMALE';
  educationalAttainment: string;
  beneficiaryName?: string;
  resumeFile?: File;
  encoder: string;
  status: 'PENDING' | 'APPROVED' | 'DEPLOYED' | 'COMPLETED' | 'REJECTED' | 'RESIGNED';
  dateSubmitted: string;
  program: 'GIP' | 'TUPAD';
  // TUPAD-specific fields
  idType?: string;
  idNumber?: string;
  occupation?: string;
  civilStatus?: string;
  averageMonthlyIncome?: string;
  dependentName?: string;
  relationshipToDependent?: string;
}

export interface Statistics {
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

export interface BarangayStats {
  barangay: string;
  total: number;
  male: number;
  female: number;
  pending: number;
  approved: number;
  deployed: number;
  completed: number;
  rejected: number;
  resigned: number;
}

export interface StatusStats {
  status: string;
  total: number;
  male: number;
  female: number;
  color: string;
}

export interface GenderStats {
  gender: 'MALE' | 'FEMALE';
  total: number;
  pending: number;
  approved: number;
  deployed: number;
  completed: number;
  rejected: number;
  resigned: number;
}

// Storage keys
const STORAGE_KEYS = {
  GIP_APPLICANTS: 'gip_applicants',
  TUPAD_APPLICANTS: 'tupad_applicants',
  APPLICANT_COUNTER: 'applicant_counter'
};

// Get applicants from localStorage
export const getApplicants = (program: 'GIP' | 'TUPAD'): Applicant[] => {
  const key = program === 'GIP' ? STORAGE_KEYS.GIP_APPLICANTS : STORAGE_KEYS.TUPAD_APPLICANTS;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Save applicants to localStorage
export const saveApplicants = (program: 'GIP' | 'TUPAD', applicants: Applicant[]): void => {
  const key = program === 'GIP' ? STORAGE_KEYS.GIP_APPLICANTS : STORAGE_KEYS.TUPAD_APPLICANTS;
  localStorage.setItem(key, JSON.stringify(applicants));
};

// Generate next applicant code
export const generateApplicantCode = (program: 'GIP' | 'TUPAD'): string => {
  // Get existing applicants to determine next number
  const existingApplicants = getApplicants(program);
  
  // Find the highest existing number for this program
  let maxNumber = 0;
  existingApplicants.forEach(applicant => {
    const codeMatch = applicant.code.match(new RegExp(`${program}-(\\d+)`));
    if (codeMatch) {
      const number = parseInt(codeMatch[1], 10);
      if (number > maxNumber) {
        maxNumber = number;
      }
    }
  });
  
  // Next number is maxNumber + 1
  const nextNumber = maxNumber + 1;
  const paddedNumber = nextNumber.toString().padStart(6, '0');
  return `${program}-${paddedNumber}`;
};

// Add new applicant
export const addApplicant = (applicantData: Omit<Applicant, 'id' | 'code' | 'dateSubmitted'>): Applicant => {
  const applicants = getApplicants(applicantData.program);
  
  const newApplicant: Applicant = {
    ...applicantData,
    id: Date.now().toString(),
    code: generateApplicantCode(applicantData.program),
    dateSubmitted: new Date().toISOString().split('T')[0]
  };
  
  applicants.push(newApplicant);
  saveApplicants(applicantData.program, applicants);
  
  return newApplicant;
};

// Update applicant
export const updateApplicant = (program: 'GIP' | 'TUPAD', updatedApplicant: Applicant): void => {
  const applicants = getApplicants(program);
  const index = applicants.findIndex(a => a.id === updatedApplicant.id);
  
  if (index !== -1) {
    applicants[index] = updatedApplicant;
    saveApplicants(program, applicants);
  }
};

// Delete applicant
export const deleteApplicant = (program: 'GIP' | 'TUPAD', applicantId: string): void => {
  const applicants = getApplicants(program);
  const filteredApplicants = applicants.filter(a => a.id !== applicantId);
  saveApplicants(program, filteredApplicants);
};

// Get statistics for a program
export const getStatistics = (program: 'GIP' | 'TUPAD'): Statistics => {
  const applicants = getApplicants(program);
  
  const stats: Statistics = {
    totalApplicants: applicants.length,
    pending: applicants.filter(a => a.status === 'PENDING').length,
    approved: applicants.filter(a => a.status === 'APPROVED').length,
    deployed: applicants.filter(a => a.status === 'DEPLOYED').length,
    completed: applicants.filter(a => a.status === 'COMPLETED').length,
    rejected: applicants.filter(a => a.status === 'REJECTED').length,
    resigned: applicants.filter(a => a.status === 'RESIGNED').length,
    barangaysCovered: [...new Set(applicants.map(a => a.barangay))].length,
    maleCount: applicants.filter(a => a.gender === 'MALE').length,
    femaleCount: applicants.filter(a => a.gender === 'FEMALE').length
  };
  
  return stats;
};

// Get barangay statistics
export const getBarangayStatistics = (program: 'GIP' | 'TUPAD'): BarangayStats[] => {
  const applicants = getApplicants(program);
  const barangays = [
    'APLAYA', 'BALIBAGO', 'CAINGIN', 'DILA', 'DITA', 'DON JOSE', 'IBABA', 
    'KANLURAN', 'LABAS', 'MACABLING', 'MALITLIT', 'MALUSAK', 'MARKET AREA', 
    'POOC', 'PULONG SANTA CRUZ', 'SANTO DOMINGO', 'SINALHAN', 'TAGAPO'
  ];
  
  return barangays.map(barangay => {
    const barangayApplicants = applicants.filter(a => a.barangay === barangay);
    
    return {
      barangay,
      total: barangayApplicants.length,
      male: barangayApplicants.filter(a => a.gender === 'MALE').length,
      female: barangayApplicants.filter(a => a.gender === 'FEMALE').length,
      pending: barangayApplicants.filter(a => a.status === 'PENDING').length,
      approved: barangayApplicants.filter(a => a.status === 'APPROVED').length,
      deployed: barangayApplicants.filter(a => a.status === 'DEPLOYED').length,
      completed: barangayApplicants.filter(a => a.status === 'COMPLETED').length,
      rejected: barangayApplicants.filter(a => a.status === 'REJECTED').length,
      resigned: barangayApplicants.filter(a => a.status === 'RESIGNED').length
    };
  });
};

// Get status statistics
export const getStatusStatistics = (program: 'GIP' | 'TUPAD'): StatusStats[] => {
  const applicants = getApplicants(program);
  const statuses = [
    { name: 'PENDING', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'APPROVED', color: 'bg-blue-100 text-blue-800' },
    { name: 'DEPLOYED', color: 'bg-green-100 text-green-800' },
    { name: 'COMPLETED', color: 'bg-pink-100 text-pink-800' },
    { name: 'REJECTED', color: 'bg-orange-100 text-orange-800' },
    { name: 'RESIGNED', color: 'bg-gray-100 text-gray-800' }
  ];
  
  return statuses.map(status => {
    const statusApplicants = applicants.filter(a => a.status === status.name);
    
    return {
      status: status.name,
      total: statusApplicants.length,
      male: statusApplicants.filter(a => a.gender === 'MALE').length,
      female: statusApplicants.filter(a => a.gender === 'FEMALE').length,
      color: status.color
    };
  });
};

// Get gender statistics
export const getGenderStatistics = (program: 'GIP' | 'TUPAD'): GenderStats[] => {
  const applicants = getApplicants(program);
  const genders: ('MALE' | 'FEMALE')[] = ['MALE', 'FEMALE'];
  
  return genders.map(gender => {
    const genderApplicants = applicants.filter(a => a.gender === gender);
    
    return {
      gender,
      total: genderApplicants.length,
      pending: genderApplicants.filter(a => a.status === 'PENDING').length,
      approved: genderApplicants.filter(a => a.status === 'APPROVED').length,
      deployed: genderApplicants.filter(a => a.status === 'DEPLOYED').length,
      completed: genderApplicants.filter(a => a.status === 'COMPLETED').length,
      rejected: genderApplicants.filter(a => a.status === 'REJECTED').length,
      resigned: genderApplicants.filter(a => a.status === 'RESIGNED').length
    };
  });
};

// Filter applicants based on criteria
export const filterApplicants = (
  program: 'GIP' | 'TUPAD',
  filters: {
    searchTerm?: string;
    status?: string;
    barangay?: string;
    gender?: string;
    ageRange?: string;
    education?: string;
  }
): Applicant[] => {
  let applicants = getApplicants(program);
  
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    applicants = applicants.filter(a => 
      a.firstName.toLowerCase().includes(searchLower) ||
      a.lastName.toLowerCase().includes(searchLower) ||
      a.code.toLowerCase().includes(searchLower) ||
      a.barangay.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.status && filters.status !== 'All Status') {
    applicants = applicants.filter(a => a.status === filters.status);
  }
  
  if (filters.barangay && filters.barangay !== 'All Barangays') {
    applicants = applicants.filter(a => a.barangay === filters.barangay);
  }
  
  if (filters.gender && filters.gender !== 'All Genders') {
    applicants = applicants.filter(a => a.gender === filters.gender);
  }
  
  if (filters.ageRange && filters.ageRange !== 'All Ages') {
    const [min, max] = filters.ageRange.split('-').map(n => parseInt(n.replace('+', '')));
    if (max) {
      applicants = applicants.filter(a => a.age >= min && a.age <= max);
    } else {
      applicants = applicants.filter(a => a.age >= min);
    }
  }
  
  if (filters.education && filters.education !== 'All Education Levels') {
    applicants = applicants.filter(a => a.educationalAttainment === filters.education);
  }
  
  return applicants;
};

// Calculate age from birth date
export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Initialize sample data (for demo purposes)
export const initializeSampleData = (): void => {
  // Only initialize if no data exists
  if (getApplicants('GIP').length === 0 && getApplicants('TUPAD').length === 0) {
    // Add a few sample applicants for demonstration
    const sampleGIPApplicant: Omit<Applicant, 'id' | 'code' | 'dateSubmitted'> = {
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      birthDate: '2000-01-15',
      age: 24,
      barangay: 'BALIBAGO',
      contactNumber: '09123456789',
      gender: 'MALE',
      educationalAttainment: 'COLLEGE GRADUATE',
      encoder: 'Administrator',
      status: 'PENDING',
      program: 'GIP'
    };
    
    const sampleTUPADApplicant: Omit<Applicant, 'id' | 'code' | 'dateSubmitted'> = {
      firstName: 'Maria',
      lastName: 'Santos',
      birthDate: '1995-05-20',
      age: 29,
      barangay: 'DITA',
      contactNumber: '09987654321',
      gender: 'FEMALE',
      educationalAttainment: 'HIGH SCHOOL GRADUATE',
      encoder: 'Administrator',
      status: 'APPROVED',
      program: 'TUPAD'
    };
    
    addApplicant(sampleGIPApplicant);
    addApplicant(sampleTUPADApplicant);
  }
};