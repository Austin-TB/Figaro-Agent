import axios from 'axios';
import type { ChatRequest, ChatResponse, ApiError } from '../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ChatAPI {
  static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await api.post<ChatResponse>('/chat', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError: ApiError = error.response.data;
        throw new Error(apiError.detail || 'Failed to send message');
      }
      throw new Error('Network error: Could not connect to server');
    }
  }

  static async healthCheck(): Promise<boolean> {
    try {
      await api.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

export default ChatAPI; 