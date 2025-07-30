import { useState, useEffect, useRef } from 'react';

export default function ComponentPreview({ jsx, css }) {
  const iframeRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jsx || !css) return;

    try {
      const iframe = iframeRef.current;
      if (!iframe) return;

      // Create the HTML content for the iframe
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            }
            ${css}
          </style>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            ${jsx.replace('export default', 'const GeneratedComponent =')}
            
            // Use React 18 createRoot API
            try {
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(React.createElement(GeneratedComponent));
            } catch (error) {
              console.error('React rendering error:', error);
              document.getElementById('root').innerHTML = '<div style="color: red; padding: 20px;">Error rendering component: ' + error.message + '</div>';
            }
          </script>
        </body>
        </html>
      `;

      // Create a blob URL for the iframe
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      iframe.src = url;
      
      // Clean up the blob URL when component unmounts or content changes
      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      setError(err.message);
      console.error('Preview error:', err);
    }
  }, [jsx, css]);

  if (!jsx && !css) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">🎨</div>
          <p className="text-lg mb-2">Component Preview</p>
          <p className="text-sm">Generated components will appear here</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center text-red-600">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-lg mb-2">Preview Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Component Preview</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
      </div>
      
      <iframe
        ref={iframeRef}
        className="flex-1 w-full border-0"
        title="Component Preview"
      />
    </div>
  );
}