import { create } from 'zustand';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

interface GeneratedComponent {
  jsx: string;
  css: string;
  generatedAt: Date;
}

interface Session {
  _id: string;
  title: string;
  chatHistory: ChatMessage[];
  currentComponent: GeneratedComponent;
  componentHistory: GeneratedComponent[];
  createdAt: Date;
  updatedAt: Date;
}

interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  isLoading: boolean;
  error: string | null;
  setSessions: (sessions: Session[]) => void;
  setCurrentSession: (session: Session | null) => void;
  addMessage: (message: ChatMessage) => void;
  updateCurrentComponent: (component: GeneratedComponent) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,
  setSessions: (sessions) => set({ sessions }),
  setCurrentSession: (session) => set({ currentSession: session }),
  addMessage: (message) => {
    const { currentSession } = get();
    if (currentSession) {
      set({
        currentSession: {
          ...currentSession,
          chatHistory: [...currentSession.chatHistory, message],
        },
      });
    }
  },
  updateCurrentComponent: (component) => {
    const { currentSession } = get();
    if (currentSession) {
      set({
        currentSession: {
          ...currentSession,
          currentComponent: component,
        },
      });
    }
  },
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));