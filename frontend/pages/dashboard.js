import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Chat from '../components/Chat';
import CodeViewer from '../components/CodeViewer';
import ComponentPreview from '../components/ComponentPreview';
import SessionList from '../components/SessionList';

export default function Dashboard({ user, setUser }) {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [showSessions, setShowSessions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    loadSessions();
  }, [user, router]);

  const loadSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/sessions', 
        { name: `Session ${Date.now()}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentSession(response.data);
      setSessions([response.data, ...sessions]);
      setShowSessions(false);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const loadSession = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentSession(response.data);
      setShowSessions(false);
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className={`${showSessions ? 'w-80' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-200`}>
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setShowSessions(!showSessions)}
            className="w-full flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            {showSessions ? '←' : '→'}
          </button>
        </div>
        
        {showSessions && (
          <div className="p-4">
            <button
              onClick={createNewSession}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded mb-4 hover:bg-blue-700"
            >
              New Session
            </button>
            
            <SessionList
              sessions={sessions}
              currentSession={currentSession}
              onSelectSession={loadSession}
            />
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={logout}
                className="w-full text-red-600 py-2 px-4 rounded hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Chat */}
        <div className="w-1/3 border-r border-gray-200">
          <Chat
            currentSession={currentSession}
            onSessionUpdate={setCurrentSession}
          />
        </div>

        {/* Right Panel - Preview and Code */}
        <div className="flex-1 flex flex-col">
          {/* Component Preview */}
          <div className="flex-1 p-4">
            <ComponentPreview
              jsx={currentSession?.currentCode?.jsx || ''}
              css={currentSession?.currentCode?.css || ''}
            />
          </div>

          {/* Code Viewer */}
          <div className="h-1/2 border-t border-gray-200">
            <CodeViewer
              jsx={currentSession?.currentCode?.jsx || ''}
              css={currentSession?.currentCode?.css || ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
}