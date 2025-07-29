'use client';

import React from 'react';
import { Trash2, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/helpers';
import { Session } from '@/types';

interface SessionCardProps {
  session: Session;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  isActive,
  onSelect,
  onDelete,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      onClick={onSelect}
      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
        isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {session.title}
          </h3>
          <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(session.updatedAt)}</span>
          </div>
          <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
            <MessageSquare className="h-3 w-3" />
            <span>{session.chatHistory?.length ?? 0} messages</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="flex-shrink-0 text-gray-400 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}; 