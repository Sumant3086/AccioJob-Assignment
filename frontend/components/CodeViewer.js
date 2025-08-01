import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function CodeViewer({ jsx, css }) {
  const [activeTab, setActiveTab] = useState('jsx');
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const downloadCode = async () => {
    try {
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
        description: 'React component generated with AI Component Generator',
        main: 'Component.jsx',
        dependencies: {
          react: '^18.0.0',
          'react-dom': '^18.0.0'
        },
        scripts: {
          start: 'react-scripts start',
          build: 'react-scripts build',
          test: 'react-scripts test',
          eject: 'react-scripts eject'
        }
      };
      zip.file('package.json', JSON.stringify(packageJson, null, 2));
      
      // Add README
      const readme = `# Generated Component

This component was generated using AI Component Generator.

## Files
- \`Component.jsx\` - The React component
- \`styles.css\` - Component styles

## Usage

\`\`\`jsx
import GeneratedComponent from './Component';
import './styles.css';

function App() {
  return <GeneratedComponent />;
}
\`\`\`

## Features
- Responsive design
- Modern styling
- Easy to customize

Generated on: ${new Date().toLocaleDateString()}
`;
      zip.file('README.md', readme);

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'generated-component.zip');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download files');
    }
  };

  const getLineCount = (code) => {
    return code ? code.split('\n').length : 0;
  };

  return (
    <div className="h-full bg-white border-t border-gray-200">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'jsx'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('jsx')}
        >
          JSX ({getLineCount(jsx)} lines)
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'css'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('css')}
        >
          CSS ({getLineCount(css)} lines)
        </button>
        
        <div className="ml-auto flex items-center space-x-2 px-4">
          <button
            onClick={() => copyToClipboard(activeTab === 'jsx' ? jsx : css)}
            className={`text-xs px-3 py-1 rounded transition-colors ${
              copySuccess 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            disabled={!jsx && !css}
          >
            {copySuccess ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={downloadCode}
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded transition-colors"
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
              className="m-0 text-sm leading-relaxed bg-gray-50 p-4 overflow-auto font-mono"
              style={{
                fontSize: '14px',
                lineHeight: '1.5',
                backgroundColor: '#f8fafc',
                padding: '16px',
                overflow: 'auto',
                fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              <code>{jsx}</code>
            </pre>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-lg mb-2">No JSX code generated yet</p>
              <p className="text-sm">Start a conversation to generate React components</p>
            </div>
          )
        ) : (
          css ? (
            <pre
              className="m-0 text-sm leading-relaxed bg-gray-50 p-4 overflow-auto font-mono"
              style={{
                fontSize: '14px',
                lineHeight: '1.5',
                backgroundColor: '#f8fafc',
                padding: '16px',
                overflow: 'auto',
                fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              <code>{css}</code>
            </pre>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-4">🎨</div>
              <p className="text-lg mb-2">No CSS code generated yet</p>
              <p className="text-sm">Start a conversation to generate styled components</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}