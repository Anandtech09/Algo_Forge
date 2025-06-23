
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CodeAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: string;
  isLoading: boolean;
}

const CodeAnalysisModal: React.FC<CodeAnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
  isLoading
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            AI Code Analysis & Execution Steps
          </DialogTitle>
          <DialogDescription>
            Detailed analysis of your code including execution steps and complexity
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Analyzing your code...</span>
            </div>
          ) : (
            <div className="prose max-w-none">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <pre className="whitespace-pre-wrap text-sm text-blue-900 font-mono">
                  {analysis || 'No analysis available'}
                </pre>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeAnalysisModal;
