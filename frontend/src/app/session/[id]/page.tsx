<<<<<<< HEAD
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ComponentPreview } from '@/components/preview/ComponentPreview';
import { ExportTools } from '@/components/export/ExportTools';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useAuthStore } from '@/store/authStore';
import { useSessionStore } from '@/store/sessionStore';
import { sessionService } from '@/services/sessions';
import toast from 'react-hot-toast';

const SessionPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const { isAuthenticated } = useAuthStore();
  const { 
    currentSession, 
    setCurrentSession, 
    addMessage, 
    updateCurrentComponent,
    setLoading, 
    isLoading 
  } = useSessionStore();

  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (sessionId) {
      loadSession(sessionId);
    }
  }, [isAuthenticated, sessionId]);

  const loadSession = async (id: string) => {
    try {
      setLoading(true);
      const response = await sessionService.getSession(id);
      setCurrentSession(response.session);
    } catch (error: any) {
      toast.error('Failed to load session');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSession = async () => {
    try {
      const response = await sessionService.createSession('New Session');
      router.push(`/session/${response.session._id}`);
    } catch (error: any) {
      toast.error('Failed to create session');
    }
  };

  const handleSessionSelect = (newSessionId: string) => {
    router.push(`/session/${newSessionId}`);
  };

  const handleSendMessage = async (message: string, imageUrl?: string) => {
    if (!currentSession) return;

    try {
      setIsSendingMessage(true);

      // Add user message optimistically
      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: message,
        timestamp: new Date(),
        imageUrl,
      };
      addMessage(userMessage);

      // Send to API
      const response = await sessionService.sendMessage(currentSession._id, message, imageUrl);

      // Add AI response and update component
      addMessage(response.message);
      updateCurrentComponent(response.component);

      toast.success('Component generated successfully!');
    } catch (error: any) {
      toast.error('Failed to send message');
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (!isAuthenticated) {
    return <Loading text="Checking authentication..." />;
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <Loading text="Loading session..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          onNewSession={handleNewSession}
          onSessionSelect={handleSessionSelect}
          currentSessionId={sessionId}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
                <div className="h-6 w-px bg-gray-300" />
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentSession?.title || 'Session'}
                </h1>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportPanel(!showExportPanel)}
              >
                Export Component
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex">
            {/* Chat */}
            <div className="flex-1 flex">
              <ChatInterface
                session={currentSession}
                isLoading={isSendingMessage}
                onSendMessage={handleSendMessage}
              />
            </div>

            {/* Preview */}
            <div className="w-1/2 border-l border-gray-200">
              <ComponentPreview component={currentSession?.currentComponent || null} />
            </div>

            {/* Export Panel */}
            {showExportPanel && (
              <div className="w-80 border-l border-gray-200 bg-white">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Export</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowExportPanel(false)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
                <ExportTools component={currentSession?.currentComponent || null} />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

=======
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ComponentPreview } from '@/components/preview/ComponentPreview';
import { ExportTools } from '@/components/export/ExportTools';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useAuthStore } from '@/store/authStore';
import { useSessionStore } from '@/store/sessionStore';
import { sessionService } from '@/services/sessions';
import toast from 'react-hot-toast';

const SessionPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const { isAuthenticated } = useAuthStore();
  const { 
    currentSession, 
    setCurrentSession, 
    addMessage, 
    updateCurrentComponent,
    setLoading, 
    isLoading 
  } = useSessionStore();

  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (sessionId) {
      loadSession(sessionId);
    }
  }, [isAuthenticated, sessionId]);

  const loadSession = async (id: string) => {
    try {
      setLoading(true);
      const response = await sessionService.getSession(id);
      setCurrentSession(response.session);
    } catch (error: any) {
      toast.error('Failed to load session');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSession = async () => {
    try {
      const response = await sessionService.createSession('New Session');
      router.push(`/session/${response.session._id}`);
    } catch (error: any) {
      toast.error('Failed to create session');
    }
  };

  const handleSessionSelect = (newSessionId: string) => {
    router.push(`/session/${newSessionId}`);
  };

  const handleSendMessage = async (message: string, imageUrl?: string) => {
    if (!currentSession) return;

    try {
      setIsSendingMessage(true);

      // Add user message optimistically
      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: message,
        timestamp: new Date(),
        imageUrl,
      };
      addMessage(userMessage);

      // Send to API
      const response = await sessionService.sendMessage(currentSession._id, message, imageUrl);

      // Add AI response and update component
      addMessage(response.message);
      updateCurrentComponent(response.component);

      toast.success('Component generated successfully!');
    } catch (error: any) {
      toast.error('Failed to send message');
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (!isAuthenticated) {
    return <Loading text="Checking authentication..." />;
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <Loading text="Loading session..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          onNewSession={handleNewSession}
          onSessionSelect={handleSessionSelect}
          currentSessionId={sessionId}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
                <div className="h-6 w-px bg-gray-300" />
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentSession?.title || 'Session'}
                </h1>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportPanel(!showExportPanel)}
              >
                Export Component
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex">
            {/* Chat */}
            <div className="flex-1 flex">
              <ChatInterface
                session={currentSession}
                isLoading={isSendingMessage}
                onSendMessage={handleSendMessage}
              />
            </div>

            {/* Preview */}
            <div className="w-1/2 border-l border-gray-200">
              <ComponentPreview component={currentSession?.currentComponent || null} />
            </div>

            {/* Export Panel */}
            {showExportPanel && (
              <div className="w-80 border-l border-gray-200 bg-white">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Export</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowExportPanel(false)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
                <ExportTools component={currentSession?.currentComponent || null} />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

>>>>>>> 89eac74 (initial push,still working on)
export default SessionPage;