import axiosInstance from './api/axiosConfig';

class CollaborationService {
  async getAllCollaborationRequests() {
    try {
      const response = await axiosInstance.get('/collab-requests/all');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async acceptCollaborationRequest(requestId) {
    try {
      const response = await axiosInstance.post(`/collab-requests/${requestId}/accept`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteCollaborationRequest(requestId) {
    try {
      const response = await axiosInstance.delete(`/collab-requests/${requestId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async updateCollaborationRequest(requestId, payload) {
    try {
      const response = await axiosInstance.put(`/collab-requests/${requestId}`, payload);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async createCollaborationRequest(payload) {
    try {
      const response = await axiosInstance.post('/collab-requests', payload);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CollaborationService();
