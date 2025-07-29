<<<<<<< HEAD
'use client';

import React from 'react';
import { SessionCard } from './SessionCard';
import { Loading } from '@/components/ui/Loading';
import { Session } from '@/types';
import { sessionService } from '@/services/sessions';
import toast from 'react-hot-toast';

interface SessionListProps {
  sessions: Session[];
  currentSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  onSessionsChange: () => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  currentSessionId,
  onSessionSelect,
  onSessionsChange,
}) => {
  const handleDelete = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      await sessionService.deleteSession(sessionId);
      toast.success('Session deleted successfully');
      onSessionsChange();
    } catch (error) {
      toast.error('Failed to delete session');
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No sessions yet.</p>
        <p className="text-sm">Create your first session to get started!</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {sessions.map((session) => (
        <SessionCard
          key={session._id}
          session={session}
          isActive={session._id === currentSessionId}
          onSelect={() => onSessionSelect(session._id)}
          onDelete={() => handleDelete(session._id)}
        />
      ))}
    </div>
  );
=======
'use client';

import React from 'react';
import { SessionCard } from './SessionCard';
import { Loading } from '@/components/ui/Loading';
import { Session } from '@/types';
import { sessionService } from '@/services/sessions';
import toast from 'react-hot-toast';

interface SessionListProps {
  sessions: Session[];
  currentSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  onSessionsChange: () => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  currentSessionId,
  onSessionSelect,
  onSessionsChange,
}) => {
  const handleDelete = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      await sessionService.deleteSession(sessionId);
      toast.success('Session deleted successfully');
      onSessionsChange();
    } catch (error) {
      toast.error('Failed to delete session');
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No sessions yet.</p>
        <p className="text-sm">Create your first session to get started!</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {sessions.map((session) => (
        <SessionCard
          key={session._id}
          session={session}
          isActive={session._id === currentSessionId}
          onSelect={() => onSessionSelect(session._id)}
          onDelete={() => handleDelete(session._id)}
        />
      ))}
    </div>
  );
>>>>>>> 89eac74 (initial push,still working on)
};