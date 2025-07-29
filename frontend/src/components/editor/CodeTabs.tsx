<<<<<<< HEAD
'use client';

import React, { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { downloadFile } from '@/utils/helpers';
import { GeneratedComponent } from '@/types';
import toast from 'react-hot-toast';

interface CodeTabsProps {
  component: GeneratedComponent | null;
}

export const CodeTabs: React.FC<CodeTabsProps> = ({ component }) => {
  const [activeTab, setActiveTab] = useState<'jsx' | 'css'>('jsx');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const copyToClipboard = async (content: string, tabName: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedTab(tabName);
      toast.success(`${tabName.toUpperCase()} copied to clipboard!`);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadCode = () => {
    if (!component) return;

    const zip = require('jszip')();
    zip.file('Component.jsx', component.jsx);
    zip.file('Component.css', component.css);

    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'component.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });

    toast.success('Component downloaded as ZIP!');
  };

  if (!component) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p>No component generated yet</p>
          <p className="text-sm">Start chatting to generate code</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'jsx', label: 'JSX', content: component.jsx },
    { id: 'css', label: 'CSS', content: component.css },
  ];

  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 rounded-lg">
      {/* Tab Headers */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'jsx' | 'css')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const activeContent = tabs.find(t => t.id === activeTab)?.content || '';
              copyToClipboard(activeContent, activeTab);
            }}
            className="flex items-center space-x-1"
          >
            {copiedTab === activeTab ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span>Copy</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={downloadCode}
            className="flex items-center space-x-1"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-hidden">
        <pre className="h-full overflow-auto p-4 text-sm font-mono bg-gray-50">
          <code className="language-javascript">
            {tabs.find(t => t.id === activeTab)?.content}
          </code>
        </pre>
      </div>
    </div>
  );
=======
'use client';

import React, { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { downloadFile } from '@/utils/helpers';
import { GeneratedComponent } from '@/types';
import toast from 'react-hot-toast';

interface CodeTabsProps {
  component: GeneratedComponent | null;
}

export const CodeTabs: React.FC<CodeTabsProps> = ({ component }) => {
  const [activeTab, setActiveTab] = useState<'jsx' | 'css'>('jsx');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const copyToClipboard = async (content: string, tabName: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedTab(tabName);
      toast.success(`${tabName.toUpperCase()} copied to clipboard!`);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadCode = () => {
    if (!component) return;

    const zip = require('jszip')();
    zip.file('Component.jsx', component.jsx);
    zip.file('Component.css', component.css);

    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'component.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });

    toast.success('Component downloaded as ZIP!');
  };

  if (!component) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p>No component generated yet</p>
          <p className="text-sm">Start chatting to generate code</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'jsx', label: 'JSX', content: component.jsx },
    { id: 'css', label: 'CSS', content: component.css },
  ];

  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 rounded-lg">
      {/* Tab Headers */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'jsx' | 'css')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const activeContent = tabs.find(t => t.id === activeTab)?.content || '';
              copyToClipboard(activeContent, activeTab);
            }}
            className="flex items-center space-x-1"
          >
            {copiedTab === activeTab ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span>Copy</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={downloadCode}
            className="flex items-center space-x-1"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-hidden">
        <pre className="h-full overflow-auto p-4 text-sm font-mono bg-gray-50">
          <code className="language-javascript">
            {tabs.find(t => t.id === activeTab)?.content}
          </code>
        </pre>
      </div>
    </div>
  );
>>>>>>> 89eac74 (initial push,still working on)
};