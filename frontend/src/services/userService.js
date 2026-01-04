import axiosInstance from './api/axiosConfig';

class UserService {
  async getBulkUsers(ids) {
    try {
      const query = ids.map(id => `ids=${id}`).join('&');
      const response = await axiosInstance.get(`/users/bulk?${query}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const response = await axiosInstance.get(`/users/by-email/${encodeURIComponent(email)}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Get user profile
  async getProfile(userId) {
    try {
      const response = await axiosInstance.get(`/users/profile/${userId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Get current user's profile
  async getMyProfile() {
    try {
      const response = await axiosInstance.get('/users/profile/me');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await axiosInstance.put('/users/profile', profileData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
