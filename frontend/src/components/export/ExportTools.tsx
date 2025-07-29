'use client';

import React from 'react';
import { Download, FileText, Archive } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GeneratedComponent } from '@/types';
import { downloadFile } from '@/utils/helpers';
import toast from 'react-hot-toast';

interface ExportToolsProps {
  component: GeneratedComponent | null;
}

export const ExportTools: React.FC<ExportToolsProps> = ({ component }) => {
  const exportAsJSX = () => {
    if (!component) return;
    downloadFile(combinedContent, 'component-package.txt', 'text/plain');
    toast.success('Component package downloaded!');
  };

  if (!component) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No component to export</p>
        <p className="text-sm">Generate a component first</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Export Options</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={exportAsJSX}
          variant="outline"
          className="flex items-center justify-center space-x-2 p-4 h-auto"
        >
          <FileText className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">JSX File</div>
            <div className="text-xs text-gray-500">Component.jsx</div>
          </div>
        </Button>

        <Button
          onClick={exportAsCSS}
          variant="outline"
          className="flex items-center justify-center space-x-2 p-4 h-auto"
        >
          <FileText className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">CSS File</div>
            <div className="text-xs text-gray-500">Component.css</div>
          </div>
        </Button>

        <Button
          onClick={exportAsZip}
          variant="outline"
          className="flex items-center justify-center space-x-2 p-4 h-auto"
        >
          <Archive className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Bundle</div>
            <div className="text-xs text-gray-500">Combined files</div>
          </div>
        </Button>

        <Button
          onClick={exportAsPackage}
          variant="outline"
          className="flex items-center justify-center space-x-2 p-4 h-auto"
        >
          <Download className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Package</div>
            <div className="text-xs text-gray-500">With package.json</div>
          </div>
        </Button>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-2">Export includes:</p>
          <ul className="space-y-1 text-xs">
            <li>• React component (JSX/TSX)</li>
            <li>• CSS styles</li>
            <li>• Package configuration</li>
            <li>• Usage documentation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};