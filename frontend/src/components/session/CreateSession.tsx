<<<<<<< HEAD
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

interface CreateSessionProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSession: (title: string) => void;
  isLoading?: boolean;
}

export const CreateSession: React.FC<CreateSessionProps> = ({
  isOpen,
  onClose,
  onCreateSession,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSession(title || 'New Session');
    setTitle('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Session">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Session Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter session title (optional)"
        />
        
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            Create Session
          </Button>
        </div>
      </form>
    </Modal>
  );
=======
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

interface CreateSessionProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSession: (title: string) => void;
  isLoading?: boolean;
}

export const CreateSession: React.FC<CreateSessionProps> = ({
  isOpen,
  onClose,
  onCreateSession,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSession(title || 'New Session');
    setTitle('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Session">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Session Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter session title (optional)"
        />
        
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            Create Session
          </Button>
        </div>
      </form>
    </Modal>
  );
>>>>>>> 89eac74 (initial push,still working on)
};