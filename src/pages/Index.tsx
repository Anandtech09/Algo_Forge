
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, Brain, Trophy, Play, Users, Sparkles, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Index: React.FC = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Learning",
      description: "Get personalized explanations and hints powered by Groq and OpenRouter AI models",
      color: "bg-blue-500"
    },
    {
      icon: <Play className="h-8 w-8" />,
      title: "Interactive Visualizations",
      description: "See algorithms in action with step-by-step visual demonstrations",
      color: "bg-green-500"
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Live Python Editor",
      description: "Practice with a built-in Python interpreter and code editor",
      color: "bg-purple-500"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "500+ Practice Problems",
      description: "Challenge yourself with coding problems from easy to expert level",
      color: "bg-orange-500"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Progress Tracking",
      description: "Monitor your learning journey and skill development",
      color: "bg-red-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Platform",
      description: "Connect with peers, share solutions, and learn together",
      color: "bg-indigo-500"
    }
  ];

  const categories = [
    {
      title: "Data Structures",
      description: "Master Arrays, Trees, Graphs, and more",
      icon: <BookOpen className="h-6 w-6" />,
      path: "/data-structures",
      topics: ["Arrays", "Linked Lists", "Trees", "Graphs", "Hash Tables"],
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Algorithms",
      description: "Learn Sorting, Searching, DP, and Greedy",
      icon: <Brain className="h-6 w-6" />,
      path: "/algorithms",
      topics: ["Sorting", "Searching", "Dynamic Programming", "Graph Algorithms"],
      color: "from-green-500 to-green-600"
    },
    {
      title: "Practice Hub",
      description: "Solve problems with instant feedback",
      icon: <Trophy className="h-6 w-6" />,
      path: "/practice",
      topics: ["Easy", "Medium", "Hard", "Contest Problems"],
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Code Playground",
      description: "Write and test Python code live",
      icon: <Code className="h-6 w-6" />,
      path: "/playground",
      topics: ["Python REPL", "AI Explanations", "Code Templates"],
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered DSA Learning Platform
              </Badge>
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Master Data Structures & Algorithms
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Learn, practice, and visualize DSA concepts with AI-powered explanations, 
              interactive coding environment, and comprehensive problem sets.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/practice">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Zap className="h-5 w-5 mr-2" />
                  Start Learning
                </Button>
              </Link>
              <Link to="/visualizations">
                <Button size="lg" variant="outline">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Data Structures</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
            <div className="text-gray-600">Algorithms</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
            <div className="text-gray-600">Practice Problems</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">∞</div>
            <div className="text-gray-600">AI Explanations</div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Learning Paths</h2>
          <p className="text-xl text-gray-600">Choose your area of focus and start your journey</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <CardTitle className="text-2xl">{category.title}</CardTitle>
                <CardDescription className="text-lg">{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {category.topics.map((topic, topicIndex) => (
                    <Badge key={topicIndex} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
                <Link to={category.path}>
                  <Button className={`w-full bg-gradient-to-r ${category.color} hover:opacity-90`}>
                    Explore {category.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600">Everything you need to master DSA</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center text-white mx-auto mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers mastering Data Structures and Algorithms with our AI-powered platform
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/practice">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Practicing Now
              </Button>
            </Link>
            <Link to="/community">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
