<<<<<<< HEAD
'use client';

import React, { useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { GeneratedComponent } from '@/types';

interface CodeEditorProps {
  component: GeneratedComponent | null;
  onCodeChange?: (jsx: string, css: string) => void;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  component,
  onCodeChange,
  readOnly = true,
}) => {
  const [activeTab, setActiveTab] = React.useState<'jsx' | 'css'>('jsx');
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!onCodeChange || !component) return;

    const newValue = value || '';
    if (activeTab === 'jsx') {
      onCodeChange(newValue, component.css);
    } else {
      onCodeChange(component.jsx, newValue);
    }
  };

  if (!component) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p>No component to edit</p>
        </div>
      </div>
    );
  }

  const currentContent = activeTab === 'jsx' ? component.jsx : component.css;
  const language = activeTab === 'jsx' ? 'javascript' : 'css';

  return (
    <div className="h-full flex flex-col">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab('jsx')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'jsx'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          JSX
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'css'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          CSS
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={currentContent}
          theme="vs-light"
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          options={{
            readOnly,
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
=======
'use client';

import React, { useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { GeneratedComponent } from '@/types';

interface CodeEditorProps {
  component: GeneratedComponent | null;
  onCodeChange?: (jsx: string, css: string) => void;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  component,
  onCodeChange,
  readOnly = true,
}) => {
  const [activeTab, setActiveTab] = React.useState<'jsx' | 'css'>('jsx');
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!onCodeChange || !component) return;

    const newValue = value || '';
    if (activeTab === 'jsx') {
      onCodeChange(newValue, component.css);
    } else {
      onCodeChange(component.jsx, newValue);
    }
  };

  if (!component) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p>No component to edit</p>
        </div>
      </div>
    );
  }

  const currentContent = activeTab === 'jsx' ? component.jsx : component.css;
  const language = activeTab === 'jsx' ? 'javascript' : 'css';

  return (
    <div className="h-full flex flex-col">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab('jsx')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'jsx'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          JSX
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'css'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          CSS
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={currentContent}
          theme="vs-light"
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          options={{
            readOnly,
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
>>>>>>> 89eac74 (initial push,still working on)
};