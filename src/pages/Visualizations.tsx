import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Play, RefreshCw, Settings, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AlgorithmVisualizer from '@/components/AlgorithmVisualizer';

const Visualizations: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialAlgorithm = searchParams.get('algorithm') || 'bubble-sort';
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(initialAlgorithm);
  const [currentData, setCurrentData] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [inputData, setInputData] = useState('64,34,25,12,22,11,90');
  const [error, setError] = useState('');

  // Update search params when algorithm changes
  useEffect(() => {
    setSearchParams({ algorithm: selectedAlgorithm });
  }, [selectedAlgorithm, setSearchParams]);

  // Validate and update data when input changes
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData(e.target.value);
    try {
      const parsed = e.target.value.split(',').map(num => {
        const n = parseInt(num.trim());
        if (isNaN(n)) throw new Error('Invalid number');
        return n;
      });
      if (parsed.length === 0) throw new Error('Array cannot be empty');
      setCurrentData(parsed);
      setError('');
    } catch {
      setError('Please enter comma-separated numbers (e.g., 64,34,25,12,22,11,90)');
    }
  };

  const generateRandomData = () => {
    const newData = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 1);
    setCurrentData(newData);
    setInputData(newData.join(','));
    setError('');
  };

  const algorithmCategories = {
    sorting: {
      label: 'Sorting Algorithms',
      algorithms: {
        'bubble-sort': {
          name: 'Bubble Sort',
          complexity: { time: 'O(n²)', space: 'O(1)' },
          description: 'Simple comparison-based sorting'
        },
        'quick-sort': {
          name: 'Quick Sort',
          complexity: { time: 'O(n log n)', space: 'O(log n)' },
          description: 'Divide-and-conquer sorting'
        },
        'merge-sort': {
          name: 'Merge Sort',
          complexity: { time: 'O(n log n)', space: 'O(n)' },
          description: 'Stable divide-and-conquer sorting'
        },
        'insertion-sort': {
          name: 'Insertion Sort',
          complexity: { time: 'O(n²)', space: 'O(1)' },
          description: 'Builds sorted array one element at a time'
        },
        'selection-sort': {
          name: 'Selection Sort',
          complexity: { time: 'O(n²)', space: 'O(1)' },
          description: 'Finds minimum and places at beginning'
        },
        'heap-sort': {
          name: 'Heap Sort',
          complexity: { time: 'O(n log n)', space: 'O(1)' },
          description: 'Uses binary heap data structure'
        },
        'radix-sort': {
          name: 'Radix Sort',
          complexity: { time: 'O(d(n+k))', space: 'O(n+k)' },
          description: 'Non-comparison integer sorting'
        },
        'counting-sort': {
          name: 'Counting Sort',
          complexity: { time: 'O(n+k)', space: 'O(k)' },
          description: 'Integer sorting by counting occurrences'
        }
      }
    },
    searching: {
      label: 'Searching Algorithms',
      algorithms: {
        'linear-search': {
          name: 'Linear Search',
          complexity: { time: 'O(n)', space: 'O(1)' },
          description: 'Sequential search through elements'
        },
        'binary-search': {
          name: 'Binary Search',
          complexity: { time: 'O(log n)', space: 'O(1)' },
          description: 'Efficient search in sorted arrays'
        },
        'jump-search': {
          name: 'Jump Search',
          complexity: { time: 'O(√n)', space: 'O(1)' },
          description: 'Jumps by fixed steps then linear search'
        },
        'exponential-search': {
          name: 'Exponential Search',
          complexity: { time: 'O(log n)', space: 'O(1)' },
          description: 'Finds range then binary search'
        },
        'interpolation-search': {
          name: 'Interpolation Search',
          complexity: { time: 'O(log log n)', space: 'O(1)' },
          description: 'Estimates position in uniformly distributed data'
        },
        'ternary-search': {
          name: 'Ternary Search',
          complexity: { time: 'O(log n)', space: 'O(1)' },
          description: 'Divides array into three parts'
        }
      }
    },
    graph: {
      label: 'Graph Algorithms',
      algorithms: {
        'bfs': {
          name: 'Breadth-First Search',
          complexity: { time: 'O(V + E)', space: 'O(V)' },
          description: 'Level-by-level graph traversal'
        },
        'dfs': {
          name: 'Depth-First Search',
          complexity: { time: 'O(V + E)', space: 'O(V)' },
          description: 'Deep exploration of graph paths'
        },
        'dijkstra': {
          name: "Dijkstra's Algorithm",
          complexity: { time: 'O((V + E) log V)', space: 'O(V)' },
          description: 'Shortest path in weighted graph'
        },
        'bellman-ford': {
          name: 'Bellman-Ford',
          complexity: { time: 'O(VE)', space: 'O(V)' },
          description: 'Shortest path with negative weights'
        },
        'floyd-warshall': {
          name: 'Floyd-Warshall',
          complexity: { time: 'O(V³)', space: 'O(V²)' },
          description: 'All-pairs shortest path'
        },
        'kruskals': {
          name: "Kruskal's MST",
          complexity: { time: 'O(E log E)', space: 'O(V)' },
          description: 'Minimum spanning tree using edges'
        },
        'prims': {
          name: "Prim's MST",
          complexity: { time: 'O(V² or E log V)', space: 'O(V)' },
          description: 'Minimum spanning tree using vertices'
        },
        'topological-sort': {
          name: 'Topological Sort',
          complexity: { time: 'O(V + E)', space: 'O(V)' },
          description: 'Linear ordering of directed acyclic graph'
        }
      }
    },
    tree: {
      label: 'Tree Algorithms',
      algorithms: {
        'inorder': {
          name: 'In-order Traversal',
          complexity: { time: 'O(n)', space: 'O(h)' },
          description: 'Left-Root-Right traversal'
        },
        'preorder': {
          name: 'Pre-order Traversal',
          complexity: { time: 'O(n)', space: 'O(h)' },
          description: 'Root-Left-Right traversal'
        },
        'postorder': {
          name: 'Post-order Traversal',
          complexity: { time: 'O(n)', space: 'O(h)' },
          description: 'Left-Right-Root traversal'
        },
        'level-order': {
          name: 'Level-order Traversal',
          complexity: { time: 'O(n)', space: 'O(w)' },
          description: 'Breadth-first tree traversal'
        },
        'bst-insert': {
          name: 'BST Insertion',
          complexity: { time: 'O(log n)', space: 'O(log n)' },
          description: 'Insert node in binary search tree'
        },
        'bst-delete': {
          name: 'BST Deletion',
          complexity: { time: 'O(log n)', space: 'O(log n)' },
          description: 'Delete node from binary search tree'
        },
        'avl-rotation': {
          name: 'AVL Rotation',
          complexity: { time: 'O(1)', space: 'O(1)' },
          description: 'Balance AVL tree using rotations'
        },
        'red-black-fix': {
          name: 'Red-Black Fix',
          complexity: { time: 'O(log n)', space: 'O(1)' },
          description: 'Fix red-black tree violations'
        }
      }
    },
    dynamic: {
      label: 'Dynamic Programming',
      algorithms: {
        'fibonacci': {
          name: 'Fibonacci Sequence',
          complexity: { time: 'O(n)', space: 'O(n)' },
          description: 'Dynamic programming fibonacci'
        },
        'knapsack': {
          name: '0/1 Knapsack',
          complexity: { time: 'O(nW)', space: 'O(nW)' },
          description: 'Maximum value with weight constraint'
        },
        'lcs': {
          name: 'Longest Common Subsequence',
          complexity: { time: 'O(mn)', space: 'O(mn)' },
          description: 'Find longest common subsequence'
        },
        'edit-distance': {
          name: 'Edit Distance',
          complexity: { time: 'O(mn)', space: 'O(mn)' },
          description: 'Minimum operations to transform string'
        },
        'coin-change': {
          name: 'Coin Change',
          complexity: { time: 'O(amount × coins)', space: 'O(amount)' },
          description: 'Minimum coins for target amount'
        }
      }
    }
  };

  const getCurrentAlgorithmInfo = () => {
    for (const category of Object.values(algorithmCategories)) {
      if (category.algorithms[selectedAlgorithm]) {
        return category.algorithms[selectedAlgorithm];
      }
    }
    return null;
  };

  const handleAlgorithmSelect = (algo: string) => {
    setSelectedAlgorithm(algo);
    // Scroll to visualizer container
    document.getElementById('visualizer-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const algorithmInfo = getCurrentAlgorithmInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Fixed Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 text-gray-900 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Algorithm Visualizations</h1>
            <div className="w- haciénd24"></div>
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
              Algorithm Visualizations
            </h1>
            <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Watch algorithms come to life with interactive step-by-step visualizations
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Algorithm Selection */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-20">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Select Algorithm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="sorting" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-2">
                    <TabsTrigger value="sorting">Sort</TabsTrigger>
                    <TabsTrigger value="searching">Search</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid w-full grid-cols-2 mb-2">
                    <TabsTrigger value="graph">Graph</TabsTrigger>
                    <TabsTrigger value="tree">Tree</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid w-full grid-cols-1 mb-4">
                    <TabsTrigger value="dynamic">Dynamic</TabsTrigger>
                  </TabsList>
                  {Object.entries(algorithmCategories).map(([categoryKey, category]) => (
                    <TabsContent key={categoryKey} value={categoryKey} className="space-y-3 max-h-[65vh] overflow-auto">
                      {Object.entries(category.algorithms).map(([algoKey, algo]) => (
                        <div
                          key={algoKey}
                          className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md transform hover:-translate-y-1 ${
                            selectedAlgorithm === algoKey
                              ? 'bg-blue-50 border-blue-500 shadow-md'
                              : 'bg-white/80 border-gray-200 hover:bg-white'
                          }`}
                          onClick={() => handleAlgorithmSelect(algoKey)}
                        >
                          <div className="font-semibold text-gray-900">{algo.name}</div>
                          <div className="text-sm text-gray-600 mt-1.5">{algo.description}</div>
                          <div className="text-xs text-gray-500 mt-1 space-y-1">
                            <div>Time: <code className="bg-gray-100 px-1 rounded">{algo.complexity.time}</code></div>
                            <div>Space: <code className="bg-gray-100 px-1 rounded">{algo.complexity.space}</code></div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Main Visualization Area */}
          <div id="visualizer-container" className="lg:col-span-3">
            {error ? (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <p className="text-red-500 text-center">Please fix the input data to view the visualization.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-xl">
                      <Play className="h-5 w-5 mr-2" />
                      {algorithmInfo?.name || 'Algorithm Visualization'}
                    </CardTitle>
                    <Badge variant="outline" className="px-3 py-1">
                      Interactive
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <AlgorithmVisualizer
                    algorithm={selectedAlgorithm}
                    data={currentData}
                    onStepChange={(step) => {
                      console.log('Current step:', step);
                    }}
                  />
                </CardContent>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mt-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Data Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">Enter Data (comma-separated):</label>
                      <Input
                        value={inputData}
                        onChange={handleDataChange}
                        placeholder="e.g., 64,34,25,12,22,11,90"
                        className={error ? 'border-red-500' : ''}
                      />
                      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                    <Button onClick={generateRandomData} className="w-full bg-green-600 hover:bg-green-700">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Random Data
                    </Button>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">Current Data:</label>
                      <div className="text-sm bg-gray-100 p-3 rounded-lg border">
                        <code className="font-mono">[{currentData.join(', ')}]</code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {algorithmInfo && (
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mt-2">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Info className="h-5 w-5 mr-2" />
                        Algorithm Info
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <span className="font-medium text-gray-900">Time Complexity:</span>
                          <code className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {algorithmInfo.complexity.time}
                          </code>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <span className="font-medium text-gray-900">Space Complexity:</span>
                          <code className="ml-2 bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                            {algorithmInfo.complexity.space}
                          </code>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="font-medium text-gray-900">Description:</span>
                          <p className="text-sm text-gray-600 mt-1">{algorithmInfo.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizations;