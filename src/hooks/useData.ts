import { useState, useEffect, useCallback } from 'react';
import {
  Applicant,
  Statistics,
  BarangayStats,
  StatusStats,
  GenderStats,
  getApplicants,
  getStatistics,
  getBarangayStatistics,
  getStatusStatistics,
  getGenderStatistics,
  filterApplicants,
  addApplicant,
  updateApplicant,
  archiveApplicant,
  unarchiveApplicant,
  deleteApplicant,
  initializeSampleData
} from '../utils/dataService.ts';

const defaultStats: Statistics = {
  totalApplicants: 0,
  pending: 0,
  approved: 0,
  deployed: 0,
  completed: 0,
  rejected: 0,
  resigned: 0,
  barangaysCovered: 0,
  maleCount: 0,
  femaleCount: 0
};

export const useData = (program: 'GIP' | 'TUPAD') => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [statistics, setStatistics] = useState<Statistics>(defaultStats);
  const [barangayStats, setBarangayStats] = useState<BarangayStats[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStats[]>([]);
  const [genderStats, setGenderStats] = useState<GenderStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    try {
      const allApplicants = getApplicants(program) || [];
      const stats = getStatistics(program) || defaultStats;
      const barangayData = getBarangayStatistics(program) || [];
      const statusData = getStatusStatistics(program) || [];
      const genderData = getGenderStatistics(program) || [];

      setApplicants(allApplicants);
      setStatistics(stats);
      setBarangayStats(barangayData);
      setStatusStats(statusData);
      setGenderStats(genderData);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setStatistics(defaultStats);
    } finally {
      setIsLoading(false);
    }
  }, [program]);

  useEffect(() => {
    try {
      initializeSampleData();
      refreshData();
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }, [program, refreshData]);

  const handleAddApplicant = useCallback(
    (applicantData: Omit<Applicant, 'id' | 'code' | 'dateSubmitted'>) => {
      try {
        const newApplicant = addApplicant(applicantData);
        refreshData();
        return newApplicant;
      } catch (error) {
        console.error('Error adding applicant:', error);
        throw error;
      }
    },
    [refreshData]
  );

  const handleUpdateApplicant = useCallback(
    (updatedApplicant: Applicant) => {
      try {
        updateApplicant(program, updatedApplicant);
        refreshData();
      } catch (error) {
        console.error('Error updating applicant:', error);
        throw error;
      }
    },
    [program, refreshData]
  );

  const handleArchiveApplicant = useCallback(
    (applicantId: string) => {
      try {
        archiveApplicant(program, applicantId);
        refreshData();
      } catch (error) {
        console.error('Error archiving applicant:', error);
        throw error;
      }
    },
    [program, refreshData]
  );

  const handleUnarchiveApplicant = useCallback(
    (applicantId: string) => {
      try {
        unarchiveApplicant(program, applicantId);
        refreshData();
      } catch (error) {
        console.error('Error unarchiving applicant:', error);
        throw error;
      }
    },
    [program, refreshData]
  );

  const handleDeleteApplicant = useCallback(
    (applicantId: string) => {
      try {
        deleteApplicant(program, applicantId);
        refreshData();
      } catch (error) {
        console.error('Error deleting applicant:', error);
        throw error;
      }
    },
    [program, refreshData]
  );

  const getFilteredApplicants = useCallback(
    (filters: {
      searchTerm?: string;
      status?: string;
      barangay?: string;
      gender?: string;
      ageRange?: string;
      education?: string;
    }) => filterApplicants(program, filters),
    [program]
  );

  return {
    applicants,
    statistics,
    barangayStats,
    statusStats,
    genderStats,
    isLoading,
    refreshData,
    addApplicant: handleAddApplicant,
    updateApplicant: handleUpdateApplicant,
    archiveApplicant: handleArchiveApplicant,
    unarchiveApplicant: handleUnarchiveApplicant,
    deleteApplicant: handleDeleteApplicant,
    getFilteredApplicants
  };
};
