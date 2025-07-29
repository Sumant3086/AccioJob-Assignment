'use client';

import React, { useEffect } from 'react';
import { Plus, MessageSquare, Code, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SessionList } from '@/components/session/SessionList';
import { useSessionStore } from '@/store/sessionStore';
import { sessionService } from '@/services/sessions';
import toast from 'react-hot-toast';

interface SidebarProps {
  onNewSession: () => void;
  onSessionSelect: (sessionId: string) => void;
  currentSessionId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onNewSession,
  onSessionSelect,
  currentSessionId,
}) => {
  const { sessions, setSessions, setLoading, setError } = useSessionStore();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionService.getSessions();
      setSessions(response.sessions);
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSession = async () => {
    try {
      await onNewSession();
      await loadSessions(); // Refresh the list
    } catch (error) {
      toast.error('Failed to create new session');
    }
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Button
          onClick={handleNewSession}
          className="w-full flex items-center justify-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Session</span>
        </Button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        <SessionList
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSessionSelect={onSessionSelect}
          onSessionsChange={loadSessions}
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MessageSquare className="h-4 w-4" />
            <span>AI-Powered Generation</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Code className="h-4 w-4" />
            <span>Live Preview</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Download className="h-4 w-4" />
            <span>Export Components</span>
          </div>
        </div>
      </div>
    </div>
  );
};