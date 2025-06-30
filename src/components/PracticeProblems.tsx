import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Code, Clock, Trophy, Settings } from 'lucide-react';
import { savePracticeProgress, loadPracticeProgress } from '@/services/practiceProgress';
import ProblemDialog from './ProblemDialog';
import practiceData from '@/data/practiceProblems.json';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  timeEstimate: string;
  points: number;
}

const practiceProblems = practiceData.problems as Problem[];

const PracticeProblems: React.FC = () => {
  const [completedProblems, setCompletedProblems] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isProblemDialogOpen, setIsProblemDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const categories = ['All', ...Array.from(new Set(practiceProblems.map(p => p.category)))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    const loadProgress = async () => {
      setLoading(true);
      try {
        const progress = await loadPracticeProgress();
        setCompletedProblems(progress);
      } catch (error) {
        console.error('Failed to load practice progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  const handleMarkComplete = async (problemId: string) => {
    const isCompleted = completedProblems[problemId];
    const newStatus = !isCompleted;
    
    setCompletedProblems(prev => ({
      ...prev,
      [problemId]: newStatus
    }));

    try {
      await savePracticeProgress(problemId, newStatus);
    } catch (error) {
      console.error('Failed to save progress:', error);
      setCompletedProblems(prev => ({
        ...prev,
        [problemId]: isCompleted
      }));
    }
  };

  const handleStartProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setIsProblemDialogOpen(true);
  };

  const handleFilterChange = (type: 'category' | 'difficulty', value: string) => {
    if (type === 'category') {
      setSelectedCategory(value);
    } else {
      setSelectedDifficulty(value);
    }
    document.getElementById('problems-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredProblems = practiceProblems.filter(problem => {
    const categoryMatch = selectedCategory === 'All' || problem.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalCompleted = Object.values(completedProblems).filter(Boolean).length;
  const totalPoints = practiceProblems
    .filter(p => completedProblems[p.id])
    .reduce((sum, p) => sum + p.points, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
      {/* Left Panel - Filters and Stats */}
      <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-20">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700">Category</label>
              <div className="flex flex-wrap gap-2 max-h-[30vh] overflow-y-auto">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFilterChange('category', category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700">Difficulty</label>
              <div className="flex flex-wrap gap-2 max-h-[30vh] overflow-y-auto">
                {difficulties.map(difficulty => (
                  <Button
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFilterChange('difficulty', difficulty)}
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Progress Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
              <div>
                <p className="text-lg font-bold">{totalCompleted}</p>
                <p className="text-sm text-gray-600">Problems Solved</p>
              </div>
            </div>
            <div className="flex items-center">
              <Trophy className="h-6 w-6 text-yellow-500 mr-3" />
              <div>
                <p className="text-lg font-bold">{totalPoints}</p>
                <p className="text-sm text-gray-600">Points Earned</p>
              </div>
            </div>
            <div className="flex items-center">
              <Code className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <p className="text-lg font-bold">{Math.round((totalCompleted / practiceProblems.length) * 100)}%</p>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Problems List */}
      <div id="problems-container" className="lg:col-span-7">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Code className="h-5 w-5 mr-2" />
              Practice Problems
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProblems.length === 0 ? (
              <div className="text-center py-8">
                <Code className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Problems Found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more problems.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[84vh] overflow-y-auto">
                {filteredProblems.map((problem) => {
                  const isCompleted = completedProblems[problem.id];
                  return (
                    <Card
                      key={problem.id}
                      className={`transition-all duration-200 ${
                        isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-md'
                      }`}
                    >
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{problem.title}</CardTitle>
                            {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(problem.difficulty)}>
                              {problem.difficulty}
                            </Badge>
                            <Badge variant="outline">{problem.category}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CardDescription className="text-sm">{problem.description}</CardDescription>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {problem.timeEstimate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Trophy className="h-4 w-4" />
                              {problem.points} points
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            variant={isCompleted ? 'secondary' : 'default'}
                            onClick={() => handleStartProblem(problem)}
                          >
                            <Code className="h-1 w-4 mr-2" />
                            {isCompleted ? 'Review Solution' : 'Start Problem'}
                          </Button>
                          <Button
                            variant={isCompleted ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleMarkComplete(problem.id)}
                            className={isCompleted ? 'bg-green-600 hover:bg-green-700' : ''}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <Circle className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Problem Dialog */}
      <ProblemDialog
        isOpen={isProblemDialogOpen}
        onClose={() => setIsProblemDialogOpen(false)}
        problem={selectedProblem}
      />
    </div>
  );
};

export default PracticeProblems;