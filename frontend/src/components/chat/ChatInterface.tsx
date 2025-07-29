<<<<<<< HEAD
'use client';

import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { MessageInput } from './MessageInput';
import { Loading } from '@/components/ui/Loading';
import { Session } from '@/types';

interface ChatInterfaceProps {
  session: Session | null;
  isLoading: boolean;
  onSendMessage: (message: string, imageUrl?: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  session,
  isLoading,
  onSendMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.chatHistory]);

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">No session selected</p>
          <p className="text-sm">Select a session or create a new one to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{session.title}</h2>
        <p className="text-sm text-gray-500">
          {session.chatHistory.length} messages
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {session.chatHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm">Ask me to create any React component you need!</p>
            </div>
          </div>
        ) : (
          <>
            {session.chatHistory.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex max-w-3xl">
                  <div className="mr-3">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                    <Loading size="sm" text="Generating component..." />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
=======
'use client';

import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { MessageInput } from './MessageInput';
import { Loading } from '@/components/ui/Loading';
import { Session } from '@/types';

interface ChatInterfaceProps {
  session: Session | null;
  isLoading: boolean;
  onSendMessage: (message: string, imageUrl?: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  session,
  isLoading,
  onSendMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.chatHistory]);

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">No session selected</p>
          <p className="text-sm">Select a session or create a new one to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{session.title}</h2>
        <p className="text-sm text-gray-500">
          {session.chatHistory.length} messages
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {session.chatHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm">Ask me to create any React component you need!</p>
            </div>
          </div>
        ) : (
          <>
            {session.chatHistory.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex max-w-3xl">
                  <div className="mr-3">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                    <Loading size="sm" text="Generating component..." />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
>>>>>>> 89eac74 (initial push,still working on)
};