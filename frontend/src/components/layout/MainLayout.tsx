<<<<<<< HEAD
'use client';

import React from 'react';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
=======
'use client';

import React from 'react';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
>>>>>>> 89eac74 (initial push,still working on)
};