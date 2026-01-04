import axiosInstance from './api/axiosConfig';

class JobPostService {
  async getAllJobPosts() {
    try {
      const response = await axiosInstance.get('/job-posts');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getJobPostById(id) {
    try {
      const response = await axiosInstance.get(`/job-posts/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async createJobPost(formData) {
    try {
      const response = await axiosInstance.post('/job-posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async updateJobPost(id, formData) {
    try {
      const response = await axiosInstance.put(`/job-posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteJobPost(id) {
    try {
      const response = await axiosInstance.delete(`/job-posts/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new JobPostService();
