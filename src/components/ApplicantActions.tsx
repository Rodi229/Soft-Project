import Swal from "sweetalert2";
import { Applicant } from "../utils/dataService.ts";

export const handleArchive = async (
  applicantId: string,
  applicantName: string,
  getFilteredApplicants: any,
  updateApplicant: any,
  refreshData: any
) => {
  const result = await Swal.fire({
    title: 'Delete Applicant?',
    text: `Are you sure you want to delete ${applicantName}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-2xl shadow-lg',
      confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold',
      cancelButton: 'px-5 py-2 rounded-lg text-white font-semibold'
    }
  });

  if (result.isConfirmed) {
    try {
      const applicants = getFilteredApplicants({});
      const applicant = applicants.find((a: Applicant) => a.id === applicantId);
      if (applicant) {
        await updateApplicant({
          ...applicant,
          archived: true,
          archivedDate: new Date().toISOString().split('T')[0]
        });
        await refreshData();
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The applicant has been successfully deleted. It will be permanently deleted after 30 days.',
          confirmButtonColor: '#3085d6',
          customClass: {
            popup: 'rounded-2xl shadow-lg',
            confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
          }
        });
      }
    } catch (error) {
      console.error('Error archiving applicant:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error archiving applicant. Please try again.',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'rounded-2xl shadow-lg',
          confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
        }
      });
    }
  }
};

export const handleUnarchive = async (
  applicantId: string,
  applicantName: string,
  getFilteredApplicants: any,
  updateApplicant: any,
  refreshData: any
) => {
  const result = await Swal.fire({
    title: 'Restore Applicant?',
    text: `Are you sure you want to restore ${applicantName} from the archive?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-2xl shadow-lg',
      confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold',
      cancelButton: 'px-5 py-2 rounded-lg text-white font-semibold'
    }
  });

  if (result.isConfirmed) {
    try {
      const applicants = getFilteredApplicants({});
      const applicant = applicants.find((a: Applicant) => a.id === applicantId);
      if (applicant) {
        await updateApplicant({
          ...applicant,
          archived: false,
          archivedDate: undefined
        });
        await refreshData();
        await Swal.fire({
          icon: 'success',
          title: 'Restored!',
          text: 'The applicant has been successfully restored.',
          confirmButtonColor: '#3085d6',
          customClass: {
            popup: 'rounded-2xl shadow-lg',
            confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
          }
        });
      }
    } catch (error) {
      console.error('Error restoring applicant:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error restoring applicant. Please try again.',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'rounded-2xl shadow-lg',
          confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
        }
      });
    }
  }
};

export const handleDelete = async (
  applicantId: string,
  applicantName: string,
  deleteApplicant: any
) => {
  const result = await Swal.fire({
    title: 'Delete Applicant Permanently?',
    text: `Are you sure you want to permanently delete ${applicantName}? This action cannot be undone.`,
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-2xl shadow-lg',
      confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold',
      cancelButton: 'px-5 py-2 rounded-lg text-white font-semibold'
    }
  });

  if (result.isConfirmed) {
    try {
      await deleteApplicant(applicantId);
      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The applicant has been permanently deleted.',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'rounded-2xl shadow-lg',
          confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
        }
      });
    } catch (error) {
      console.error('Error deleting applicant:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error deleting applicant. Please try again.',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'rounded-2xl shadow-lg',
          confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
        }
      });
    }
  }
};
