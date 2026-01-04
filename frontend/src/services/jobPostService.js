import axiosInstance from './api/axiosConfig';

class JobPostService {
  async getAllJobPosts() {
    try {
      const response = await axiosInstance.get('/job-post');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getJobPostById(id) {
    try {
      const response = await axiosInstance.get(`/job-post/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async createJobPost(formData) {
    try {
      const response = await axiosInstance.post('/job-post', formData, {
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
      const response = await axiosInstance.put(`/job-post/${id}`, formData, {
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
      const response = await axiosInstance.delete(`/job-post/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new JobPostService();
