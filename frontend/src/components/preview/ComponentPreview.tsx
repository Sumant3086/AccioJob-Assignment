'use client';

import React, { useState } from 'react';
import { Eye, Code, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PreviewFrame } from './PreviewFrame';
import { CodeTabs } from '@/components/editor/CodeTabs';
import { GeneratedComponent } from '@/types';

interface ComponentPreviewProps {
  component: GeneratedComponent | null;
}

export const ComponentPreview: React.FC<ComponentPreviewProps> = ({ component }) => {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'preview' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('preview')}
            className="flex items-center space-x-1"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </Button>
          <Button
            variant={viewMode === 'code' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('code')}
            className="flex items-center space-x-1"
          >
            <Code className="h-4 w-4" />
            <span>Code</span>
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {viewMode === 'preview' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center space-x-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-hidden">
        {viewMode === 'preview' ? (
          // The key ensures re-rendering on refresh
          <PreviewFrame key={refreshKey} component={component} />
        ) : (
          <CodeTabs component={component} />
        )}
      </div>
    </div>
  );
};
