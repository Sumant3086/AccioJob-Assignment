export interface User {
  id: string;
  email: string;
  name: string;
}

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