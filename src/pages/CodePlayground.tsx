import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Download, RotateCcw, Sparkles, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import CodeAnalysisModal from '@/components/CodeAnalysisModal';
import { generatePDF } from '@/utils/pdfGenerator';

interface CodeTemplate {
  [key: string]: string;
}

const CodePlayground: React.FC = () => {
  const [code, setCode] = useState<string>(`# Welcome to DSA Python Playground!
# Try implementing data structures and algorithms here

def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Test the function
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", numbers)
sorted_numbers = bubble_sort(numbers.copy())
print("Sorted array:", sorted_numbers)`);

  const [output, setOutput] = useState<string>('');
  const [complexityAnalysis, setComplexityAnalysis] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isApiKeysValid, setIsApiKeysValid] = useState<boolean>(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState<boolean>(false);
  const [detailedAnalysis, setDetailedAnalysis] = useState<string>('');
  const [isLoadingDetailedAnalysis, setIsLoadingDetailedAnalysis] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('output');

  const templates: CodeTemplate = {
    array: `# Array Operations Template
class Array:
    def __init__(self, size):
        self.size = size
        self.data = [None] * size
    
    def get(self, index):
        if 0 <= index < self.size:
            return self.data[index]
        return None
    
    def set(self, index, value):
        if 0 <= index < self.size:
            self.data[index] = value
            return True
        return False

# Test your implementation
arr = Array(5)
arr.set(0, 10)
arr.set(1, 20)
print("Array operations working:", arr.get(0), arr.get(1))`,

    linkedlist: `# Linked List Template
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def insert(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
    
    def display(self):
        elements = []
        current = self.head
        while current:
            elements.append(current.data)
            current = current.next
        return elements

# Test your implementation
ll = LinkedList()
ll.insert(1)
ll.insert(2)
ll.insert(3)
print("Linked List:", ll.display())`,

    sorting: `# Sorting Algorithm Template
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

# Test your implementations
test_array = [64, 34, 25, 12, 22, 11, 90]
print("Original:", test_array)
print("Bubble Sort:", bubble_sort(test_array.copy()))
print("Quick Sort:", quick_sort(test_array.copy()))`,

    searching: `# Searching Algorithm Template
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Test your implementations
numbers = [2, 3, 4, 10, 40]
target = 10
print("Linear Search:", linear_search(numbers, target))
print("Binary Search:", binary_search(numbers, target))`,
your_code: `
#Enter your code here`,
  };

  const validateApiKeys = async (): Promise<boolean> => {
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    if (!groqKey || !openRouterKey) {
      toast({
        title: "Missing API Keys",
        description: "Please set GROQ_API_KEY and OPENROUTER_API_KEY in your .env file.",
        variant: "destructive",
      });
      return false;
    }

    try {
      apiService.setApiKeys(groqKey.trim(), openRouterKey.trim());
      await apiService.analyzeComplexity("print('test')");
      return true;
    } catch (error) {
      console.error('API key validation failed:', error);
      toast({
        title: "Invalid API Keys",
        description: "The provided API keys are invalid. Please check your .env file.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    const checkApiKeys = async () => {
      const isValid = await validateApiKeys();
      setIsApiKeysValid(isValid);
    };

    checkApiKeys();
  }, []);

  const handleRunCode = async (): Promise<void> => {
    if (!isApiKeysValid) {
      toast({
        title: "API Keys Required",
        description: "Please configure valid API keys in your .env file.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setIsAnalyzing(true);
    setOutput('Running code...');
    setComplexityAnalysis('Analyzing complexity...');

    try {
      const [executionResult, complexityResult] = await Promise.all([
        apiService.simulateCodeExecution(code),
        apiService.analyzeComplexity(code)
      ]);

      setOutput(executionResult.output || 'No output generated.');
      setComplexityAnalysis(complexityResult);

      if (executionResult.error) {
        setOutput(`Error: ${executionResult.error}`);
        toast({
          title: "Execution Error",
          description: executionResult.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = 'Error occurred during code execution. Please check your API keys in the .env file.';
      setOutput(errorMessage);
      setComplexityAnalysis('Error analyzing complexity.');
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
      setIsAnalyzing(false);
    }
  };

  const handleGetDetailedAnalysis = async (): Promise<void> => {
    if (!isApiKeysValid) {
      toast({
        title: "API Keys Required",
        description: "Please configure valid API keys in your .env file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingDetailedAnalysis(true);
    setShowAnalysisModal(true);

    try {
      const analysis = await apiService.explainCodeExecution(code);
      setDetailedAnalysis(analysis);
    } catch (error) {
      setDetailedAnalysis('Error occurred while analyzing code execution.');
      toast({
        title: "Error",
        description: "Failed to get detailed analysis. Please check your API keys in the .env file.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDetailedAnalysis(false);
    }
  };

  const handleDownload = (): void => {
    if (!code.trim()) {
      toast({
        title: "No Content",
        description: "Please write some code before downloading.",
        variant: "destructive",
      });
      return;
    }

    generatePDF(code, output, complexityAnalysis);
    toast({
      title: "Download Started",
      description: "Your code and analysis have been exported as a PDF.",
    });
  };

  const handleReset = (): void => {
    setCode('# Write your Python code here\n');
    setOutput('');
    setComplexityAnalysis('');
    setDetailedAnalysis('');
  };

  const loadTemplate = (templateKey: string): void => {
    if (templates[templateKey]) {
      setCode(templates[templateKey]);
      setOutput('');
      setComplexityAnalysis('');
      setDetailedAnalysis('');
      document.getElementById('playground-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleRunCode();
    }
  };

  return (
    <ProtectedRoute message="Please log in to access the Code Playground">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Fixed Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-3 text-gray-900 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Code Playground</h1>
              <div className="w-24"></div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative h-64 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
              height: '120%'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-blue-900/70" />
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center text-white px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4">
                Code Playground
              </h1>
              <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Write, run, and analyze Python code with AI-powered insights
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            {/* Left Panel - Template Selection */}
            <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-20">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-6 w-5 mr-2" />
                    Select Template
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="templates" className="w-full">
                    <TabsList className="grid w-full grid-cols-1 mb-4">
                      <TabsTrigger value="templates">Templates</TabsTrigger>
                    </TabsList>
                    <TabsContent value="templates" className="space-y-3 max-h-[80vh] overflow-y-auto">
                      {Object.entries(templates).map(([key, template]) => (
                        <div
                          key={key}
                          className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md transform hover:-translate-y-1 ${
                            code === template
                              ? 'bg-blue-50 border-blue-500 shadow-md'
                              : 'bg-white/80 border-gray-200 hover:bg-white'
                          }`}
                          onClick={() => loadTemplate(key)}
                        >
                          <div className="font-semibold text-gray-900">
                            {key.charAt(0).toUpperCase() + key.slice(1)} Template
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Pre-built code for {key} operations
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Quick Help */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Quick Help
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm m-1 space-y-2">
                  <div><strong>Ctrl + Enter:</strong> Run code</div>
                  <div><strong>AI Explain:</strong> Detailed analysis</div>
                  <div><strong>Download:</strong> Export as PDF</div>
                  <div><strong>Python 3.9:</strong> AI Simulated</div>
                  {!isApiKeysValid && (
                    <div className="text-orange-600 font-medium">
                      ⚠️ API Keys needed in .env file
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Controls, Editor, and Console */}
            <div id="playground-container" className="lg:col-span-7">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
                    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                      <Button onClick={handleRunCode} disabled={!isApiKeysValid || isRunning}>
                        <Play className="h-4 w-4 mr-2" />
                        {isRunning ? 'Running...' : 'Run Code'}
                      </Button>
                      <Button
                        onClick={handleGetDetailedAnalysis}
                        disabled={!isApiKeysValid}
                        variant="outline"
                        className="sm:ml-2"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Explain
                      </Button>
                    </div>
                    <div className="flex mt-2 sm:mt-0 gap-2 flex-wrap sm:flex-nowrap">
                      <Button variant="outline" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                      <Button variant="outline" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Code Editor */}
                  <div>
                    <label className="text-sm font-medium mb-4 block text-gray-700">
                      Python Code Editor
                    </label>
                    <Textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="w-full h-80 font-mono text-sm resize-none border rounded-lg p-4"
                      placeholder="Write your Python code here..."
                    />
                  </div>
                  {/* Output Console */}
                  <div>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList>
                        <TabsTrigger value="output">Console Output</TabsTrigger>
                        <TabsTrigger value="complexity">Complexity Analysis</TabsTrigger>
                      </TabsList>
                      <TabsContent value="output" className="mt-4">
                        <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-40 overflow-auto font-mono text-sm">
                          <pre className="whitespace-pre-wrap">
                            {output || 'Click "Run Code" to see output here...'}
                          </pre>
                        </div>
                      </TabsContent>
                      <TabsContent value="complexity" className="mt-4">
                        <div className="bg-blue-50 p-4 rounded-lg h-40 overflow-auto">
                          <div className="text-blue-800 text-sm">
                            {isAnalyzing ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                Analyzing complexity...
                              </div>
                            ) : complexityAnalysis ? (
                              <div className="whitespace-pre-wrap">{complexityAnalysis}</div>
                            ) : (
                              <div>
                                <strong>Complexity Analysis:</strong>
                                <p className="mt-2">
                                  Run your code to see time and space complexity analysis here.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <CodeAnalysisModal
          isOpen={showAnalysisModal}
          onClose={() => setShowAnalysisModal(false)}
          analysis={detailedAnalysis}
          isLoading={isLoadingDetailedAnalysis}
        />
      </div>
    </ProtectedRoute>
  );
};

export default CodePlayground;