import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function CodeViewer({ jsx, css }) {
  const [activeTab, setActiveTab] = useState('jsx');

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const downloadCode = () => {
    const zip = new JSZip();
    
    if (jsx) {
      zip.file('Component.jsx', jsx);
    }
    if (css) {
      zip.file('styles.css', css);
    }
    
    // Add package.json
    const packageJson = {
      name: 'generated-component',
      version: '1.0.0',
      dependencies: {
        react: '^18.0.0',
        'react-dom': '^18.0.0'
      }
    };
    zip.file('package.json', JSON.stringify(packageJson, null, 2));
    
    // Add README
    const readme = `# Generated Component

This component was generated using AI Component Generator.

## Usage

\`\`\`jsx
import GeneratedComponent from './Component';

function App() {
  return <GeneratedComponent />;
}
\`\`\`
`;
    zip.file('README.md', readme);

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'component.zip');
    });
  };

  return (
    <div className="h-full bg-white border-t border-gray-200">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'jsx'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('jsx')}
        >
          JSX ({jsx.split('\n').length} lines)
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'css'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('css')}
        >
          CSS ({css.split('\n').length} lines)
        </button>
        
        <div className="ml-auto flex items-center space-x-2 px-4">
          <button
            onClick={() => copyToClipboard(activeTab === 'jsx' ? jsx : css)}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
            disabled={!jsx && !css}
          >
            Copy
          </button>
          <button
            onClick={downloadCode}
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded"
            disabled={!jsx && !css}
          >
            Download ZIP
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'jsx' ? (
          jsx ? (
            <pre
              style={{
                margin: 0,
                fontSize: '14px',
                lineHeight: '1.5',
                backgroundColor: '#f6f8fa',
                padding: '16px',
                overflow: 'auto',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {jsx}
            </pre>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No JSX code generated yet</p>
              <p className="text-sm mt-2">Start a conversation to generate React components</p>
            </div>
          )
        ) : (
          css ? (
            <pre
              style={{
                margin: 0,
                fontSize: '14px',
                lineHeight: '1.5',
                backgroundColor: '#f6f8fa',
                padding: '16px',
                overflow: 'auto',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {css}
            </pre>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No CSS code generated yet</p>
              <p className="text-sm mt-2">Start a conversation to generate styled components</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}