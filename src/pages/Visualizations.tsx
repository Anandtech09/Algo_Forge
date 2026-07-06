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
      if (category.algorithms[selectedAlgorithm as keyof typeof category.algorithms]) {
        return category.algorithms[selectedAlgorithm as keyof typeof category.algorithms];
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
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 text-gray-900 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Algorithm Visualizations</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            height: '120%'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-blue-900/80" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
              Algorithm Visualizations
            </h1>
            <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-slate-200">
              Watch algorithms come to life with interactive step-by-step trace animations
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Algorithm Selection */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-20">
            <Card className="bg-white/90 border border-slate-200 shadow-md rounded-2xl">
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
                <CardTitle className="flex items-center text-base sm:text-lg font-bold text-slate-800">
                  <Settings className="h-4.5 w-4.5 mr-2 text-slate-500" />
                  Select Algorithm
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-5">
                <Tabs defaultValue="sorting" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 gap-1 bg-slate-100/80 p-1 rounded-xl mb-4">
                    <TabsTrigger value="sorting" className="text-[10px] sm:text-xs py-1.5 rounded-lg font-medium">Sort</TabsTrigger>
                    <TabsTrigger value="searching" className="text-[10px] sm:text-xs py-1.5 rounded-lg font-medium">Find</TabsTrigger>
                    <TabsTrigger value="graph" className="text-[10px] sm:text-xs py-1.5 rounded-lg font-medium">Graph</TabsTrigger>
                    <TabsTrigger value="tree" className="text-[10px] sm:text-xs py-1.5 rounded-lg font-medium">Tree</TabsTrigger>
                    <TabsTrigger value="dynamic" className="text-[10px] sm:text-xs py-1.5 rounded-lg font-medium">DP</TabsTrigger>
                  </TabsList>
                  {Object.entries(algorithmCategories).map(([categoryKey, category]) => (
                    <TabsContent key={categoryKey} value={categoryKey} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                      {Object.entries(category.algorithms).map(([algoKey, algo]) => (
                        <div
                          key={algoKey}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all hover:shadow-md transform hover:-translate-y-0.5 ${
                            selectedAlgorithm === algoKey
                              ? 'bg-blue-50/50 border-blue-400 shadow-sm'
                              : 'bg-white border-slate-200 hover:bg-slate-50/30'
                          }`}
                          onClick={() => handleAlgorithmSelect(algoKey)}
                        >
                          <div className="font-bold text-sm text-slate-800">{algo.name}</div>
                          <div className="text-xs text-slate-500 mt-1 leading-relaxed">{algo.description}</div>
                          <div className="text-[10px] font-mono text-slate-400 mt-2 flex gap-3">
                            <span>Time: <code className="bg-slate-100 text-slate-650 px-1 rounded font-semibold">{algo.complexity.time}</code></span>
                            <span>Space: <code className="bg-slate-100 text-slate-650 px-1 rounded font-semibold">{algo.complexity.space}</code></span>
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
          <div id="visualizer-container" className="lg:col-span-3 space-y-6">
            {error ? (
              <Card className="bg-white/90 border border-slate-200 shadow-md">
                <CardContent className="p-6">
                  <p className="text-red-500 text-center font-medium">Please fix the input data to view the visualization.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Main Visualizer Card */}
                <Card className="bg-white/90 border border-slate-200/80 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-lg sm:text-xl font-bold text-slate-800">
                        <Play className="h-5 w-5 mr-2 text-blue-500 fill-blue-500/25" />
                        {algorithmInfo?.name || 'Algorithm Visualization'}
                      </CardTitle>
                      <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold bg-blue-100/55 text-blue-700 hover:bg-blue-100/55">
                        Interactive Sandbox
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-8">
                    <AlgorithmVisualizer
                      algorithm={selectedAlgorithm}
                      data={currentData}
                      onStepChange={(step) => {
                        console.log('Current step:', step);
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Secondary Panels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Data Controls Card */}
                  {!(
                    algorithmCategories.graph.algorithms[selectedAlgorithm as keyof typeof algorithmCategories.graph.algorithms] ||
                    algorithmCategories.tree.algorithms[selectedAlgorithm as keyof typeof algorithmCategories.tree.algorithms] ||
                    selectedAlgorithm === 'coin-change'
                  ) && (
                    <Card className="bg-white/90 border border-slate-200/80 shadow-lg rounded-2xl">
                      <CardHeader className="border-b border-slate-100/60 p-4 sm:p-5">
                        <CardTitle className="flex items-center text-base sm:text-lg font-bold text-slate-800">
                          <RefreshCw className="h-4.5 w-4.5 mr-2 text-emerald-500" />
                          Data Controls
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 space-y-4">
                        <div>
                          <label className="text-xs font-semibold mb-2 block text-slate-500 uppercase tracking-wider">Enter Data (comma-separated):</label>
                          <Input
                            value={inputData}
                            onChange={handleDataChange}
                            placeholder="e.g., 64,34,25,12,22,11,90"
                            className={`rounded-xl border-slate-200 py-5 ${error ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-blue-500'}`}
                          />
                          {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
                        </div>
                        <Button onClick={generateRandomData} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-5 text-sm font-semibold shadow-lg shadow-emerald-600/10 transition-transform hover:scale-[1.01]">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Generate Random Data
                        </Button>
                        <div>
                          <label className="text-xs font-semibold mb-2 block text-slate-500 uppercase tracking-wider">Current Array State:</label>
                          <div className="text-sm bg-slate-950 text-slate-200 p-3 rounded-xl border border-slate-900 shadow-inner">
                            <code className="font-mono text-cyan-400">[{currentData.join(', ')}]</code>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Algorithm Info Card */}
                  {algorithmInfo && (
                    <Card className={`bg-white/90 border border-slate-200/80 shadow-lg rounded-2xl ${
                      (
                        algorithmCategories.graph.algorithms[selectedAlgorithm as keyof typeof algorithmCategories.graph.algorithms] ||
                        algorithmCategories.tree.algorithms[selectedAlgorithm as keyof typeof algorithmCategories.tree.algorithms] ||
                        selectedAlgorithm === 'coin-change'
                      ) ? 'md:col-span-2' : ''
                    }`}>
                      <CardHeader className="border-b border-slate-100/60 p-4 sm:p-5">
                        <CardTitle className="flex items-center text-base sm:text-lg font-bold text-slate-800">
                          <Info className="h-4.5 w-4.5 mr-2 text-blue-500" />
                          Algorithm Parameters
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50/50 border border-blue-100 p-3.5 rounded-xl">
                            <span className="text-xs font-semibold text-slate-450 uppercase tracking-wider block mb-1">Time Complexity</span>
                            <code className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm font-bold font-mono">
                              {algorithmInfo.complexity.time}
                            </code>
                          </div>
                          <div className="bg-purple-50/50 border border-purple-100 p-3.5 rounded-xl">
                            <span className="text-xs font-semibold text-slate-450 uppercase tracking-wider block mb-1">Space Complexity</span>
                            <code className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-sm font-bold font-mono">
                              {algorithmInfo.complexity.space}
                            </code>
                          </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                          <span className="text-xs font-semibold text-slate-450 uppercase tracking-wider block mb-1">Overview Description</span>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">{algorithmInfo.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizations;