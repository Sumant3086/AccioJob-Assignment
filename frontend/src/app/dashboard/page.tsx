<<<<<<< HEAD
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ArrowRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useAuthStore } from '@/store/authStore';
import { useSessionStore } from '@/store/sessionStore';
import { sessionService } from '@/services/sessions';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { sessions, setSessions, setLoading, isLoading } = useSessionStore();
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadSessions();
  }, [isAuthenticated]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionService.getSessions();
      setSessions(response.sessions);
    } catch (error: any) {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async () => {
    try {
      setIsCreatingSession(true);
      const response = await sessionService.createSession('New Session');
      router.push(`/session/${response.session._id}`);
    } catch (error: any) {
      toast.error('Failed to create session');
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleSessionSelect = (sessionId: string) => {
    router.push(`/session/${sessionId}`);
  };

  if (!isAuthenticated) {
    return <Loading text="Checking authentication..." />;
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="mt-2 text-gray-600">
            Create and manage your React components with AI assistance
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex items-center space-x-4">
              <Button
                onClick={createNewSession}
                isLoading={isCreatingSession}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Component Session</span>
              </Button>
              <div className="text-sm text-gray-500">
                Start creating your next React component
              </div>
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Sessions</h2>
              <span className="text-sm text-gray-500">
                {sessions.length} total sessions
              </span>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <Loading text="Loading sessions..." />
            ) : sessions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Plus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium">No sessions yet</h3>
                  <p className="text-sm">Create your first component generation session</p>
                </div>
                <Button
                  onClick={createNewSession}
                  isLoading={isCreatingSession}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create First Session</span>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sessions.slice(0, 6).map((session) => (
                  <div
                    key={session._id}
                    onClick={() => handleSessionSelect(session._id)}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {session.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {(session.chatHistory?.length ?? 0)} messages
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Updated {new Date(session.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Active
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sessions.length > 6 && (
              <div className="mt-6 text-center">
                <Button variant="outline" onClick={() => {}}>
                  View All Sessions ({sessions.length})
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900">Total Sessions</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{sessions.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900">Components Generated</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {sessions.reduce(
                (acc, session) =>
                  acc + (session.componentHistory?.length ?? 0) + (session.currentComponent ? 1 : 0),
                0
              )}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900">Messages Sent</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {sessions.reduce((acc, session) => acc + (session.chatHistory?.length ?? 0), 0)}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
=======
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ArrowRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useAuthStore } from '@/store/authStore';
import { useSessionStore } from '@/store/sessionStore';
import { sessionService } from '@/services/sessions';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { sessions, setSessions, setLoading, isLoading } = useSessionStore();
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadSessions();
  }, [isAuthenticated]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionService.getSessions();
      setSessions(response.sessions);
    } catch (error: any) {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async () => {
    try {
      setIsCreatingSession(true);
      const response = await sessionService.createSession('New Session');
      router.push(`/session/${response.session._id}`);
    } catch (error: any) {
      toast.error('Failed to create session');
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleSessionSelect = (sessionId: string) => {
    router.push(`/session/${sessionId}`);
  };

  if (!isAuthenticated) {
    return <Loading text="Checking authentication..." />;
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="mt-2 text-gray-600">
            Create and manage your React components with AI assistance
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex items-center space-x-4">
              <Button
                onClick={createNewSession}
                isLoading={isCreatingSession}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Component Session</span>
              </Button>
              <div className="text-sm text-gray-500">
                Start creating your next React component
              </div>
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Sessions</h2>
              <span className="text-sm text-gray-500">
                {sessions.length} total sessions
              </span>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <Loading text="Loading sessions..." />
            ) : sessions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Plus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium">No sessions yet</h3>
                  <p className="text-sm">Create your first component generation session</p>
                </div>
                <Button
                  onClick={createNewSession}
                  isLoading={isCreatingSession}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create First Session</span>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sessions.slice(0, 6).map((session) => (
                  <div
                    key={session._id}
                    onClick={() => handleSessionSelect(session._id)}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {session.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {(session.chatHistory?.length ?? 0)} messages
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Updated {new Date(session.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Active
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sessions.length > 6 && (
              <div className="mt-6 text-center">
                <Button variant="outline" onClick={() => {}}>
                  View All Sessions ({sessions.length})
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900">Total Sessions</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{sessions.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900">Components Generated</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {sessions.reduce(
                (acc, session) =>
                  acc + (session.componentHistory?.length ?? 0) + (session.currentComponent ? 1 : 0),
                0
              )}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900">Messages Sent</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {sessions.reduce((acc, session) => acc + (session.chatHistory?.length ?? 0), 0)}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
>>>>>>> 89eac74 (initial push,still working on)
