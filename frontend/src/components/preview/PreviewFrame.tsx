'use client';

import React, { useEffect, useRef } from 'react';
import { GeneratedComponent } from '@/types';

interface PreviewFrameProps {
  component: GeneratedComponent | null;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ component }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!component || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!doc) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>${component.css || ''}</style>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/javascript">
          ${component.js || ''}
        </script>
      </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();
  }, [component]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border rounded"
      sandbox="allow-scripts allow-same-origin"
    />
  );
};
