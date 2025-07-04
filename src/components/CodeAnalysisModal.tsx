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
  isLoading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          max-w-[90vw] w-full sm:max-w-3xl max-h-[80vh] 
          overflow-y-auto 
          rounded-lg 
          p-4 sm:p-6
          bg-white
          flex flex-col
        "
        // Ensure modal is accessible and closes on overlay click
        aria-describedby="code-analysis-description"
      >
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
              AI Code Analysis & Execution Steps
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
              aria-label="Close modal"
            >
            </Button>
          </div>
          <DialogDescription className="text-sm sm:text-base text-gray-600 mt-2">
            Detailed analysis of your code including execution steps and complexity
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 sm:mt-6 flex-grow overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-sm sm:text-base text-gray-600">Analyzing your code...</span>
            </div>
          ) : (
            <div className="prose max-w-none">
              <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200">
                <pre className="whitespace-pre-wrap text-xs sm:text-sm text-blue-900 font-mono leading-relaxed">
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