import axiosInstance from './api/axiosConfig';

class ChatService {
  async getChatHeads() {
    try {
      const response = await axiosInstance.get('/chat-heads/me');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async createChatHead(userId2) {
    try {
      const response = await axiosInstance.post('/chat-heads/create', null, {
        params: { userId2 },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getMessages(chatId) {
    try {
      const response = await axiosInstance.get(`/messages/${chatId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(messageData) {
    try {
      const response = await axiosInstance.post('/messages', messageData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteChat(chatId) {
    try {
      const response = await axiosInstance.delete(`/messages/${chatId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ChatService();
