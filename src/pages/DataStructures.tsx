import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Youtube, BookOpen, TreePine, Network, Hash, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LearnMoreDialog } from '@/components/LearnMoreDialog';
import dataStructuresData from '../data/dataStructure.json';

interface DataStructure {
  id: string;
  name: string;
  description: string;
  complexity: {
    time: string;
    space: string;
  };
  applications: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  youtubeUrl: string;
  explanation: string;
  pythonCode: string;
}

const DataStructures: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDataStructure, setSelectedDataStructure] = useState<DataStructure | null>(null);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [dataStructures, setDataStructures] = useState<DataStructure[]>([]);

  useEffect(() => {
    setDataStructures(dataStructuresData);
  }, []);

  const categories = [
    'all',
    ...new Set(dataStructures.map(ds => ds.category))
  ];

  const filteredDataStructures = selectedCategory === 'all' 
    ? dataStructures 
    : dataStructures.filter(ds => ds.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Trees': return <TreePine className="h-5 w-5" />;
      case 'Graphs': return <Network className="h-5 w-5" />;
      case 'Hash Tables': return <Hash className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const handleLearnMore = (dataStructure: DataStructure) => {
    setSelectedDataStructure(dataStructure);
    setIsLearnMoreOpen(true);
  };

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
            <h1 className="text-xl font-bold text-gray-900">Data Structures</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>
      {/* Hero Section with Parallax Background */}
      <div className="relative h-96 overflow-hidden">
        {/* Parallax Background Image */}
        <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')`,
            transform: `translateY(${typeof window !== 'undefined' ? window.scrollY * 0.5 : 0}px)`,
            height: '120%'
        }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70" />
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
            Data Structures
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Master the fundamental building blocks of computer science with comprehensive guides and video tutorials
            </p>
        </div>
        </div>
    </div>

    {/* Category Filter */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8">
        {categories.map((category) => (
            <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize text-xs sm:text-sm px-3 sm:px-4 py-2 min-w-0 whitespace-nowrap"
            >
            {category === 'all' ? 'All Categories' : category}
            </Button>
        ))}
        </div>

        {/* Data Structures Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {filteredDataStructures.map((dataStructure) => (
            <Card key={dataStructure.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    {getCategoryIcon(dataStructure.category)}
                    <Badge variant="secondary" className="text-xs">
                    {dataStructure.category}
                    </Badge>
                </div>
                <Badge className={`text-xs ${getDifficultyColor(dataStructure.difficulty)}`}>
                    {dataStructure.difficulty}
                </Badge>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {dataStructure.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 line-clamp-2">
                {dataStructure.description}
                </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
                <div className="space-y-4">
                {/* Complexity */}
                <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-2 text-sm">Complexity</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <span className="text-gray-600">Time:</span>
                        <span className="ml-1 font-mono text-blue-600">{dataStructure.complexity.time}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Space:</span>
                        <span className="ml-1 font-mono text-purple-600">{dataStructure.complexity.space}</span>
                    </div>
                    </div>
                </div>

                {/* Applications */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-2 text-sm">Applications</h4>
                    <div className="flex flex-wrap gap-1">
                    {dataStructure.applications.slice(0, 3).map((app, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                        {app}
                        </Badge>
                    ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pb-2 space-y-2">
                    <Button
                    asChild
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base py-2"
                    >
                    <a 
                        href={dataStructure.youtubeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2"
                    >
                        <Youtube className="h-4 w-4" />
                        <span>Watch Tutorial</span>
                    </a>
                    </Button>
                    
                    <Button
                    variant="outline"
                    className="w-full text-sm sm:text-base py-2"
                    onClick={() => handleLearnMore(dataStructure)}
                    >
                    <Info className="h-4 w-4 mr-2" />
                    <span>Learn More</span>
                    </Button>
                </div>
                </div>
            </CardContent>
            </Card>
        ))}
        </div>
    </div>

    {/* Learn More Dialog */}
    {selectedDataStructure && (
        <LearnMoreDialog
        isOpen={isLearnMoreOpen}
        onClose={() => setIsLearnMoreOpen(false)}
        item={selectedDataStructure}
        />
    )}
    </div>
  );
};

export default DataStructures;