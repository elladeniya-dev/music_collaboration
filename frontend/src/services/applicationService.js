import axiosInstance from './api/axiosConfig';

const applicationService = {
  // Submit application
  submitApplication: async (applicationData) => {
    const response = await axiosInstance.post('/applications', applicationData);
    return response.data;
  },

  // Get application by ID
  getApplicationById: async (id) => {
    const response = await axiosInstance.get(`/applications/${id}`);
    return response.data;
  },

  // Get applications for a job post (owner only)
  getApplicationsByJobPost: async (jobPostId, status = null) => {
    const params = status ? { status } : {};
    const response = await axiosInstance.get(`/applications/job-post/${jobPostId}`, { params });
    return response.data;
  },

  // Get user's own applications
  getMyApplications: async (status = null) => {
    const params = status ? { status } : {};
    const response = await axiosInstance.get('/applications/my-applications', { params });
    return response.data;
  },

  // Get applications received (for job post owners)
  getReceivedApplications: async (status = null) => {
    const params = status ? { status } : {};
    const response = await axiosInstance.get('/applications/received', { params });
    return response.data;
  },

  // Update application status (owner only)
  updateApplicationStatus: async (id, statusData) => {
    const response = await axiosInstance.put(`/applications/${id}/status`, statusData);
    return response.data;
  },

  // Withdraw application
  withdrawApplication: async (id) => {
    const response = await axiosInstance.delete(`/applications/${id}/withdraw`);
    return response.data;
  },

  // Check if user has applied
  hasUserApplied: async (jobPostId) => {
    const response = await axiosInstance.get(`/applications/check/${jobPostId}`);
    return response.data;
  },
};

export default applicationService;
