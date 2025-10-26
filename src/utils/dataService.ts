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
  telephoneNumber?: string;
  email?: string;
  placeOfBirth?: string;
  school?: string;
  gender: 'MALE' | 'FEMALE';
  civilStatus?: string;
  educationalAttainment: string;
  course?: string;
  beneficiaryName?: string;
  photoFile?: File;
  photoFileName?: string;
  photoFileData?: string;
  resumeFile?: File;
  resumeFileName?: string;
  resumeFileData?: string;
  encoder: string;
  status: 'PENDING' | 'APPROVED' | 'DEPLOYED' | 'COMPLETED' | 'REJECTED' | 'RESIGNED';
  dateSubmitted: string;
  program: 'GIP' | 'TUPAD';
  idType?: string;
  idNumber?: string;
  occupation?: string;
  averageMonthlyIncome?: string;
  dependentName?: string;
  relationshipToDependent?: string;
  archived?: boolean;
  archivedDate?: string;
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

  pendingMale: number;
  pendingFemale: number;
  approvedMale: number;
  approvedFemale: number;
  deployedMale: number;
  deployedFemale: number;
  completedMale: number;
  completedFemale: number;
  rejectedMale: number;
  rejectedFemale: number;
  resignedMale: number;
  resignedFemale: number;
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

const STORAGE_KEYS = {
  GIP_APPLICANTS: 'gip_applicants',
  TUPAD_APPLICANTS: 'tupad_applicants'
};

// ---------- Utility Functions ----------

export const getApplicants = (program: 'GIP' | 'TUPAD'): Applicant[] => {
  const key = program === 'GIP' ? STORAGE_KEYS.GIP_APPLICANTS : STORAGE_KEYS.TUPAD_APPLICANTS;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveApplicants = (program: 'GIP' | 'TUPAD', applicants: Applicant[]): void => {
  const key = program === 'GIP' ? STORAGE_KEYS.GIP_APPLICANTS : STORAGE_KEYS.TUPAD_APPLICANTS;
  localStorage.setItem(key, JSON.stringify(applicants));
};

export const generateApplicantCode = (program: 'GIP' | 'TUPAD'): string => {
  const existingApplicants = getApplicants(program);
  let maxNumber = 0;
  existingApplicants.forEach(a => {
    const match = a.code.match(new RegExp(`${program}-(\\d+)`));
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNumber) maxNumber = num;
    }
  });
  const next = (maxNumber + 1).toString().padStart(6, '0');
  return `${program}-${next}`;
};

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

export const updateApplicant = (program: 'GIP' | 'TUPAD', updatedApplicant: Applicant): void => {
  const applicants = getApplicants(program);
  const idx = applicants.findIndex(a => a.id === updatedApplicant.id);
  if (idx !== -1) {
    applicants[idx] = updatedApplicant;
    saveApplicants(program, applicants);
  }
};

export const archiveApplicant = (program: 'GIP' | 'TUPAD', applicantId: string): void => {
  const applicants = getApplicants(program);
  const idx = applicants.findIndex(a => a.id === applicantId);
  if (idx !== -1) {
    applicants[idx] = { ...applicants[idx], archived: true, archivedDate: new Date().toISOString().split('T')[0] };
    saveApplicants(program, applicants);
  }
};

export const unarchiveApplicant = (program: 'GIP' | 'TUPAD', applicantId: string): void => {
  const applicants = getApplicants(program);
  const idx = applicants.findIndex(a => a.id === applicantId);
  if (idx !== -1) {
    applicants[idx] = { ...applicants[idx], archived: false, archivedDate: undefined };
    saveApplicants(program, applicants);
  }
};

export const deleteApplicant = (program: 'GIP' | 'TUPAD', applicantId: string): void => {
  const applicants = getApplicants(program).filter(a => a.id !== applicantId);
  saveApplicants(program, applicants);
};

// ---------- Fixed getStatistics() with Gender Counts ----------
export const getStatistics = (program: 'GIP' | 'TUPAD'): Statistics => {
  const applicants = getApplicants(program).filter(a => !a.archived);

  const getGenderCount = (status: string, gender: 'MALE' | 'FEMALE') =>
    applicants.filter(a => a.status === status && a.gender === gender).length;

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
    femaleCount: applicants.filter(a => a.gender === 'FEMALE').length,

    // Gender-by-status counts
    pendingMale: getGenderCount('PENDING', 'MALE'),
    pendingFemale: getGenderCount('PENDING', 'FEMALE'),
    approvedMale: getGenderCount('APPROVED', 'MALE'),
    approvedFemale: getGenderCount('APPROVED', 'FEMALE'),
    deployedMale: getGenderCount('DEPLOYED', 'MALE'),
    deployedFemale: getGenderCount('DEPLOYED', 'FEMALE'),
    completedMale: getGenderCount('COMPLETED', 'MALE'),
    completedFemale: getGenderCount('COMPLETED', 'FEMALE'),
    rejectedMale: getGenderCount('REJECTED', 'MALE'),
    rejectedFemale: getGenderCount('REJECTED', 'FEMALE'),
    resignedMale: getGenderCount('RESIGNED', 'MALE'),
    resignedFemale: getGenderCount('RESIGNED', 'FEMALE')
  };

  return stats;
};

// ---------- Barangay / Status / Gender Stats ----------
export const getBarangayStatistics = (program: 'GIP' | 'TUPAD'): BarangayStats[] => {
  const applicants = getApplicants(program).filter(a => !a.archived);
  const barangays = [
    'APLAYA', 'BALIBAGO', 'CAINGIN', 'DILA', 'DITA', 'DON JOSE', 'IBABA',
    'KANLURAN', 'LABAS', 'MACABLING', 'MALITLIT', 'MALUSAK', 'MARKET AREA',
    'POOC', 'PULONG SANTA CRUZ', 'SANTO DOMINGO', 'SINALHAN', 'TAGAPO'
  ];
  return barangays.map(barangay => {
    const list = applicants.filter(a => a.barangay === barangay);
    return {
      barangay,
      total: list.length,
      male: list.filter(a => a.gender === 'MALE').length,
      female: list.filter(a => a.gender === 'FEMALE').length,
      pending: list.filter(a => a.status === 'PENDING').length,
      approved: list.filter(a => a.status === 'APPROVED').length,
      deployed: list.filter(a => a.status === 'DEPLOYED').length,
      completed: list.filter(a => a.status === 'COMPLETED').length,
      rejected: list.filter(a => a.status === 'REJECTED').length,
      resigned: list.filter(a => a.status === 'RESIGNED').length
    };
  });
};

export const getStatusStatistics = (program: 'GIP' | 'TUPAD'): StatusStats[] => {
  const applicants = getApplicants(program).filter(a => !a.archived);
  const statuses = [
    { name: 'PENDING', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'APPROVED', color: 'bg-blue-100 text-blue-800' },
    { name: 'DEPLOYED', color: 'bg-green-100 text-green-800' },
    { name: 'COMPLETED', color: 'bg-pink-100 text-pink-800' },
    { name: 'REJECTED', color: 'bg-orange-100 text-orange-800' },
    { name: 'RESIGNED', color: 'bg-gray-100 text-gray-800' }
  ];
  return statuses.map(status => {
    const list = applicants.filter(a => a.status === status.name);
    return {
      status: status.name,
      total: list.length,
      male: list.filter(a => a.gender === 'MALE').length,
      female: list.filter(a => a.gender === 'FEMALE').length,
      color: status.color
    };
  });
};

export const getGenderStatistics = (program: 'GIP' | 'TUPAD'): GenderStats[] => {
  const applicants = getApplicants(program).filter(a => !a.archived);
  return ['MALE', 'FEMALE'].map(g => {
    const list = applicants.filter(a => a.gender === g);
    return {
      gender: g as 'MALE' | 'FEMALE',
      total: list.length,
      pending: list.filter(a => a.status === 'PENDING').length,
      approved: list.filter(a => a.status === 'APPROVED').length,
      deployed: list.filter(a => a.status === 'DEPLOYED').length,
      completed: list.filter(a => a.status === 'COMPLETED').length,
      rejected: list.filter(a => a.status === 'REJECTED').length,
      resigned: list.filter(a => a.status === 'RESIGNED').length
    };
  });
};

// ---------- Filter & Helpers ----------
export const filterApplicants = (
  program: 'GIP' | 'TUPAD',
  filters: { searchTerm?: string; status?: string; barangay?: string; gender?: string; ageRange?: string; education?: string; }
): Applicant[] => {
  let list = getApplicants(program);
  if (filters.searchTerm) {
    const s = filters.searchTerm.toLowerCase();
    list = list.filter(a =>
      a.firstName.toLowerCase().includes(s) ||
      a.lastName.toLowerCase().includes(s) ||
      a.code.toLowerCase().includes(s) ||
      a.barangay.toLowerCase().includes(s)
    );
  }
  if (filters.status && filters.status !== 'All Status') list = list.filter(a => a.status === filters.status);
  if (filters.barangay && filters.barangay !== 'All Barangays') list = list.filter(a => a.barangay === filters.barangay);
  if (filters.gender && filters.gender !== 'All Genders') list = list.filter(a => a.gender === filters.gender);
  if (filters.ageRange && filters.ageRange !== 'All Ages') {
    const [min, max] = filters.ageRange.split('-').map(n => parseInt(n.replace('+', '')));
    list = max ? list.filter(a => a.age >= min && a.age <= max) : list.filter(a => a.age >= min);
  }
  if (filters.education && filters.education !== 'All Education Levels')
    list = list.filter(a => a.educationalAttainment === filters.education);
  return list;
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

// ---------- Initialize Sample Data ----------
export const initializeSampleData = (): void => {
  if (getApplicants('GIP').length === 0 && getApplicants('TUPAD').length === 0) {
    const sampleGIP: Omit<Applicant, 'id' | 'code' | 'dateSubmitted'> = {
      firstName: 'JUAN',
      lastName: 'DELA CRUZ',
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

    const sampleTUPAD: Omit<Applicant, 'id' | 'code' | 'dateSubmitted'> = {
      firstName: 'MARIA',
      lastName: 'SANTOS',
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

    addApplicant(sampleGIP);
    addApplicant(sampleTUPAD);
  }
};

// Get available years from applicants
export const getAvailableYears = (program: 'GIP' | 'TUPAD'): number[] => {
  const applicants = getApplicants(program);
  const years = new Set<number>();

  applicants.forEach(applicant => {
    if (applicant.dateSubmitted) {
      const year = new Date(applicant.dateSubmitted).getFullYear();
      years.add(year);
    }
  });

  return Array.from(years).sort((a, b) => b - a);
};

// Get statistics filtered by year
export const getStatisticsByYear = (program: 'GIP' | 'TUPAD', year?: number): Statistics => {
  let applicants = getApplicants(program).filter(a => !a.archived);

  if (year) {
    applicants = applicants.filter(a => {
      if (!a.dateSubmitted) return false;
      return new Date(a.dateSubmitted).getFullYear() === year;
    });
  }

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
    femaleCount: applicants.filter(a => a.gender === 'FEMALE').length,
    pendingMale: applicants.filter(a => a.status === 'PENDING' && a.gender === 'MALE').length,
    pendingFemale: applicants.filter(a => a.status === 'PENDING' && a.gender === 'FEMALE').length,
    approvedMale: applicants.filter(a => a.status === 'APPROVED' && a.gender === 'MALE').length,
    approvedFemale: applicants.filter(a => a.status === 'APPROVED' && a.gender === 'FEMALE').length,
    deployedMale: applicants.filter(a => a.status === 'DEPLOYED' && a.gender === 'MALE').length,
    deployedFemale: applicants.filter(a => a.status === 'DEPLOYED' && a.gender === 'FEMALE').length,
    completedMale: applicants.filter(a => a.status === 'COMPLETED' && a.gender === 'MALE').length,
    completedFemale: applicants.filter(a => a.status === 'COMPLETED' && a.gender === 'FEMALE').length,
    rejectedMale: applicants.filter(a => a.status === 'REJECTED' && a.gender === 'MALE').length,
    rejectedFemale: applicants.filter(a => a.status === 'REJECTED' && a.gender === 'FEMALE').length,
    resignedMale: applicants.filter(a => a.status === 'RESIGNED' && a.gender === 'MALE').length,
    resignedFemale: applicants.filter(a => a.status === 'RESIGNED' && a.gender === 'FEMALE').length
  };

  return stats;
};

// Get barangay statistics filtered by year
export const getBarangayStatisticsByYear = (program: 'GIP' | 'TUPAD', year?: number): BarangayStats[] => {
  let applicants = getApplicants(program).filter(a => !a.archived);

  if (year) {
    applicants = applicants.filter(a => {
      if (!a.dateSubmitted) return false;
      return new Date(a.dateSubmitted).getFullYear() === year;
    });
  }

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

// Get status statistics filtered by year
export const getStatusStatisticsByYear = (program: 'GIP' | 'TUPAD', year?: number): StatusStats[] => {
  let applicants = getApplicants(program).filter(a => !a.archived);

  if (year) {
    applicants = applicants.filter(a => {
      if (!a.dateSubmitted) return false;
      return new Date(a.dateSubmitted).getFullYear() === year;
    });
  }

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

// Get gender statistics filtered by year
export const getGenderStatisticsByYear = (program: 'GIP' | 'TUPAD', year?: number): GenderStats[] => {
  let applicants = getApplicants(program).filter(a => !a.archived);

  if (year) {
    applicants = applicants.filter(a => {
      if (!a.dateSubmitted) return false;
      return new Date(a.dateSubmitted).getFullYear() === year;
    });
  }

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
