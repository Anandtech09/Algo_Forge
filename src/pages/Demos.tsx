
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AlgorithmVideo {
  id: string;
  title: string;
  category: string;
  description: string;
  videoId: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
}

const Demos: React.FC = () => {
    const algorithmVideos: AlgorithmVideo[] = [
    // Existing videos from the original Demos component
    {
      id: 'bubble-sort',
      title: 'Bubble Sort Algorithm',
      category: 'Sorting',
      description: 'Learn how bubble sort works with step-by-step visualization',
      videoId: 'xli_FI7CuzA',
      difficulty: 'Beginner',
      duration: '6:24'
    },
    {
      id: 'quick-sort',
      title: 'Quick Sort Algorithm',
      category: 'Sorting',
      description: 'Understand the divide-and-conquer approach of quick sort',
      videoId: 'Hoixgm4-P4M',
      difficulty: 'Intermediate',
      duration: '8:53'
    },
    {
      id: 'merge-sort',
      title: 'Merge Sort Algorithm',
      category: 'Sorting',
      description: 'Master the stable sorting algorithm with O(n log n) complexity',
      videoId: '4VqmGXwpLqc',
      difficulty: 'Intermediate',
      duration: '9:47'
    },
    {
      id: 'insertion-sort',
      title: 'Insertion Sort Algorithm',
      category: 'Sorting',
      description: 'Simple and efficient for small datasets',
      videoId: 'JU767SDMDvA',
      difficulty: 'Beginner',
      duration: '5:12'
    },
    {
      id: 'selection-sort',
      title: 'Selection Sort Algorithm',
      category: 'Sorting',
      description: 'Find the minimum element and place it at the beginning',
      videoId: 'g-PGLbMth_g',
      difficulty: 'Beginner',
      duration: '4:38'
    },
    {
      id: 'heap-sort',
      title: 'Heap Sort Algorithm',
      category: 'Sorting',
      description: 'Use binary heap data structure for efficient sorting',
      videoId: '2DmK_H7IdTo',
      difficulty: 'Advanced',
      duration: '12:15'
    },
    {
      id: 'binary-search',
      title: 'Binary Search Algorithm',
      category: 'Searching',
      description: 'Efficient searching in sorted arrays with O(log n) complexity',
      videoId: 'MFhxShGxHWc',
      difficulty: 'Beginner',
      duration: '2:19'
    },
    {
      id: 'linear-search',
      title: 'Linear Search Algorithm',
      category: 'Searching',
      description: 'Sequential search through elements one by one',
      videoId: 'SGU9duLE30w',
      difficulty: 'Beginner',
      duration: '5:00'
    },
    {
      id: 'bfs',
      title: 'Breadth-First Search (BFS)',
      category: 'Graph',
      description: 'Level-by-level graph traversal using queues',
      videoId: 'oDqjPvD54Ss',
      difficulty: 'Intermediate',
      duration: '11:33'
    },
    {
      id: 'dfs',
      title: 'Depth-First Search (DFS)',
      category: 'Graph',
      description: 'Deep exploration of graph paths using stacks',
      videoId: '7fujbpJ0LB4',
      difficulty: 'Intermediate',
      duration: '10:18'
    },
    {
      id: 'dijkstra',
      title: "Dijkstra's Shortest Path",
      category: 'Graph',
      description: 'Find shortest paths in weighted graphs',
      videoId: 'pVfj6mxhdMw',
      difficulty: 'Advanced',
      duration: '15:42'
    },
    {
      id: 'fibonacci',
      title: 'Dynamic Programming - Fibonacci',
      category: 'Dynamic Programming',
      description: 'Optimize recursive solutions using memoization',
      videoId: 'oBt53YbR9Kk',
      difficulty: 'Intermediate',
      duration: '13:27'
    },
    // New videos added to match the Demos UI
    {
      id: 'radix-sort',
      title: 'Radix Sort Algorithm',
      category: 'Sorting',
      description: 'Non-comparative sorting by processing digits',
      videoId: 'JMlYkE8hGJM',
      difficulty: 'Intermediate',
      duration: '11:15'
    },
    {
      id: 'counting-sort',
      title: 'Counting Sort Algorithm',
      category: 'Sorting',
      description: 'Efficient sorting for small integer ranges',
      videoId: '7zuGmKfUt7s',
      difficulty: 'Beginner',
      duration: '5:50'
    },
    {
      id: 'knapsack-dp',
      title: 'Knapsack Problem (Dynamic Programming)',
      category: 'Dynamic Programming',
      description: 'Maximize value within weight constraints',
      videoId: '8LusJS5-AGo',
      difficulty: 'Intermediate',
      duration: '10:22'
    },
    {
      id: 'longest-common-subsequence',
      title: 'Longest Common Subsequence (LCS)',
      category: 'Dynamic Programming',
      description: 'Find the longest subsequence in two strings',
      videoId: 'jHGgXV27qtk',
      difficulty: 'Advanced',
      duration: '25:46'
    },
    {
      id: 'kruskal',
      title: "Kruskal's Minimum Spanning Tree",
      category: 'Graph',
      description: 'Build a minimum spanning tree using union-find',
      videoId: '71UQH7Pr9kU',
      difficulty: 'Advanced',
      duration: '9:35'
    },
    {
      id: 'floyd-warshall',
      title: 'Floyd-Warshall Algorithm',
      category: 'Graph',
      description: 'Find all-pairs shortest paths in a graph',
      videoId: 'Gc4mWrmJBsw',
      difficulty: 'Advanced',
      duration: '31:22'
    }
  ];

  // Update categories to include any new ones
  const categories = ['All', 'Sorting', 'Searching', 'Graph', 'Dynamic Programming'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredVideos = selectedCategory === 'All' 
    ? algorithmVideos 
    : algorithmVideos.filter(video => video.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
      <div className="max-w-9xl mx-auto">
        {/* Header */}
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Fixed Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 text-gray-900 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Algorithm Video Demos</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax Background */}
      <div className="relative h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://plus.unsplash.com/premium_photo-1675198764382-94d5c093df30?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fG5hdHVyZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D')`,
            transform: `translateY(${typeof window !== 'undefined' ? window.scrollY * 0.5 : 0}px)`,
            height: '120%'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
              Algorithm Video Demos
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Watch comprehensive video explanations of popular algorithms
            </p>
          </div>
        </div>
      </div>

        {/* Category Filter */}
        <div className="mb-8 px-8" style={{ marginTop: '20px' }}>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="mb-2"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-8">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
              <CardHeader className="pb-3">
                <div className="relative">
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                    <Play className="h-14 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute top-4 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {video.category}
                  </Badge>
                  <Badge className={`text-xs ${getDifficultyColor(video.difficulty)}`}>
                    {video.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {video.description}
                </p>
                <Button 
                  onClick={() => openVideo(video.videoId)}
                  className="w-full"
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Watch Video
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No videos message */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No videos found for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Demos;
