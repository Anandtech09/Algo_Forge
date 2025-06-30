import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Copy, X } from 'lucide-react';

interface LearnMoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    name: string;
    description: string;
    complexity?: {
      time: string;
      space: string;
    };
    applications: string[];
    difficulty: string;
    explanation: string;
    pythonCode: string;
  };
}

export const LearnMoreDialog: React.FC<LearnMoreDialogProps> = ({ isOpen, onClose, item }) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': case 'Easy': return 'bg-green-100 text-green-800';
      case 'Intermediate': case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[85vw] sm:max-w-4xl max-h-[90vh] overflow-hidden p-3 sm:p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DialogTitle className="text-xl sm:text-2xl font-bold">{item.name}</DialogTitle>
              <Badge className={getDifficultyColor(item.difficulty)}>
                {item.difficulty}
              </Badge>
            </div>
          </div>
          <DialogDescription className="text-base sm:text-lg">
            {item.description}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Complexity */}
            {item.complexity && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-base sm:text-lg mb-3">Complexity Analysis</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600 font-medium">Time Complexity:</span>
                    <code className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {item.complexity.time}
                    </code>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Space Complexity:</span>
                    <code className="ml-2 bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                      {item.complexity.space}
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* Applications */}
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3">Common Applications</h3>
              <div className="flex flex-wrap gap-2">
                {item.applications.map((app, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {app}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Detailed Explanation */}
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3">Detailed Explanation</h3>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {item.explanation}
                </p>
              </div>
            </div>

            {/* Python Code */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-base sm:text-lg">Python Implementation</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(item.pythonCode)}
                  className="text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Code
                </Button>
              </div>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                  <span className="text-gray-300 text-sm font-mono">Python</span>
                </div>
                <pre className="p-4 text-[0.65rem] sm:text-sm overflow-y-auto max-h-64 scrollbar-none whitespace-pre-wrap">
                  <code className="text-green-400 font-mono leading-relaxed">
                    {item.pythonCode}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};