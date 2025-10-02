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
  deleteApplicant,
  initializeSampleData
} from '../utils/dataService';

export const useData = (program: 'GIP' | 'TUPAD') => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
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
  });
  const [barangayStats, setBarangayStats] = useState<BarangayStats[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStats[]>([]);
  const [genderStats, setGenderStats] = useState<GenderStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    initializeSampleData();
    refreshData();
  }, [program]);

  // Refresh all data
  const refreshData = useCallback(() => {
    setIsLoading(true);
    
    try {
      const allApplicants = getApplicants(program);
      const stats = getStatistics(program);
      const barangayData = getBarangayStatistics(program);
      const statusData = getStatusStatistics(program);
      const genderData = getGenderStatistics(program);
      
      setApplicants(allApplicants);
      setStatistics(stats);
      setBarangayStats(barangayData);
      setStatusStats(statusData);
      setGenderStats(genderData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [program]);

  // Add new applicant
  const handleAddApplicant = useCallback((applicantData: Omit<Applicant, 'id' | 'code' | 'dateSubmitted'>) => {
    try {
      const newApplicant = addApplicant(applicantData);
      refreshData();
      return newApplicant;
    } catch (error) {
      console.error('Error adding applicant:', error);
      throw error;
    }
  }, [refreshData]);

  // Update applicant
  const handleUpdateApplicant = useCallback((updatedApplicant: Applicant) => {
    try {
      updateApplicant(program, updatedApplicant);
      refreshData();
    } catch (error) {
      console.error('Error updating applicant:', error);
      throw error;
    }
  }, [program, refreshData]);

  // Delete applicant
  const handleDeleteApplicant = useCallback((applicantId: string) => {
    try {
      deleteApplicant(program, applicantId);
      refreshData();
    } catch (error) {
      console.error('Error deleting applicant:', error);
      throw error;
    }
  }, [program, refreshData]);

  // Filter applicants
  const getFilteredApplicants = useCallback((filters: {
    searchTerm?: string;
    status?: string;
    barangay?: string;
    gender?: string;
    ageRange?: string;
    education?: string;
  }) => {
    return filterApplicants(program, filters);
  }, [program]);

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
    deleteApplicant: handleDeleteApplicant,
    getFilteredApplicants
  };
};