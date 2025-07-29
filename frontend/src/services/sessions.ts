<<<<<<< HEAD
import api from './api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

export interface GeneratedComponent {
  jsx: string;
  css: string;
  generatedAt: Date;
}

export interface Session {
  _id: string;
  title: string;
  chatHistory: ChatMessage[];
  currentComponent: GeneratedComponent;
  componentHistory: GeneratedComponent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SendMessageResponse {
  message: ChatMessage;
  component: GeneratedComponent;
}

export const sessionService = {
  async getSessions(): Promise<{ sessions: Session[] }> {
    const response = await api.get('/sessions');
    return response.data;
  },

  async getSession(sessionId: string): Promise<{ session: Session }> {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  },

  async createSession(title?: string): Promise<{ session: Session }> {
    const response = await api.post('/sessions', { title });
    return response.data;
  },

  async sendMessage(sessionId: string, message: string, imageUrl?: string): Promise<SendMessageResponse> {
    const response = await api.post(`/sessions/${sessionId}/messages`, {
      message,
      imageUrl,
    });
    return response.data;
  },

  async updateSession(sessionId: string, updates: Partial<Session>): Promise<{ session: Session }> {
    const response = await api.put(`/sessions/${sessionId}`, updates);
    return response.data;
  },

  async deleteSession(sessionId: string): Promise<{ message: string }> {
    const response = await api.delete(`/sessions/${sessionId}`);
    return response.data;
  },
=======
import api from './api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

export interface GeneratedComponent {
  jsx: string;
  css: string;
  generatedAt: Date;
}

export interface Session {
  _id: string;
  title: string;
  chatHistory: ChatMessage[];
  currentComponent: GeneratedComponent;
  componentHistory: GeneratedComponent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SendMessageResponse {
  message: ChatMessage;
  component: GeneratedComponent;
}

export const sessionService = {
  async getSessions(): Promise<{ sessions: Session[] }> {
    const response = await api.get('/sessions');
    return response.data;
  },

  async getSession(sessionId: string): Promise<{ session: Session }> {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  },

  async createSession(title?: string): Promise<{ session: Session }> {
    const response = await api.post('/sessions', { title });
    return response.data;
  },

  async sendMessage(sessionId: string, message: string, imageUrl?: string): Promise<SendMessageResponse> {
    const response = await api.post(`/sessions/${sessionId}/messages`, {
      message,
      imageUrl,
    });
    return response.data;
  },

  async updateSession(sessionId: string, updates: Partial<Session>): Promise<{ session: Session }> {
    const response = await api.put(`/sessions/${sessionId}`, updates);
    return response.data;
  },

  async deleteSession(sessionId: string): Promise<{ message: string }> {
    const response = await api.delete(`/sessions/${sessionId}`);
    return response.data;
  },
>>>>>>> 89eac74 (initial push,still working on)
};