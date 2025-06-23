import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code, Play, Users, Zap, Target, Award, TrendingUp, Brain, Cpu, Database, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Fixed Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex justify-between items-center p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-lg w-10 h-10 sm:w-10 sm:h-10">
              <img 
                src="/images/201a1a35-a08b-41e9-8ee3-9957543b1880.png" 
                alt="Algo-Forge" 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">Algo-Forge</div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                <Link to="/community">
                  <Button variant="outline" className="text-black">
                    <Users className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Community</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut} 
                  className="text-black"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="text-black">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax - Add top padding for fixed nav */}
      <section className="relative overflow-hidden pt-20 sm:pt-24">
        {/* Parallax Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80')`,
            transform: `translateY(${scrollY * 0.5}px)`,
            height: '120%'
          }}
        />

        {/* Animated Background Blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-48 sm:w-72 h-48 sm:h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div 
            className="absolute top-40 right-20 w-48 sm:w-72 h-48 sm:h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
            style={{ animationDelay: '2s' }}
          ></div>
          <div 
            className="absolute bottom-20 left-40 w-48 sm:w-72 h-48 sm:h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
            style={{ animationDelay: '4s' }}
          ></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20 sm:pb-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-light-green-400 mb-6 sm:mb-8 tracking-tight">
                <span className="from-green-500 to-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
                  MASTER DSA
                </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
              Master Data Structures & Algorithms with interactive visualizations, hands-on coding, and AI-powered explanations
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
              <Link to="/data-structures" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-sm sm:text-lg px-6 sm:px-10 py-4 sm:py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                  <Database className="mr-2 sm:mr-3 h-4 w-4 sm:h-6 sm:w-6" />
                  <span className="whitespace-nowrap">Explore Data Structures</span>
                </Button>
              </Link>
              <Link to="/algorithms" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-sm sm:text-lg px-6 sm:px-10 py-4 sm:py-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                  <Cpu className="mr-2 sm:mr-3 h-4 w-4 sm:h-6 sm:w-6" />
                  <span className="whitespace-nowrap">Master Algorithms</span>
                </Button>
              </Link>
              <Link to="/community" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-sm sm:text-lg px-6 sm:px-10 py-4 sm:py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                  <MessageCircle className="mr-2 sm:mr-3 h-4 w-4 sm:h-6 sm:w-6" />
                  <span className="whitespace-nowrap">Join Community</span>
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-5xl mx-auto px-4">
              <div className="bg-white/10 backdrop-blur-lg p-4 sm:p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl sm:text-4xl font-bold text-cyan-400 mb-1 sm:mb-2">15+</div>
                <div className="text-gray-300 text-sm sm:text-lg">Data Structures</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg p-4 sm:p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl sm:text-4xl font-bold text-purple-400 mb-1 sm:mb-2">30+</div>
                <div className="text-gray-300 text-sm sm:text-lg">Algorithms</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg p-4 sm:p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl sm:text-4xl font-bold text-pink-400 mb-1 sm:mb-2">100+</div>
                <div className="text-gray-300 text-sm sm:text-lg">Practice Problems</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg p-4 sm:p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl sm:text-4xl font-bold text-green-400 mb-1 sm:mb-2">AI</div>
                <div className="text-gray-300 text-sm sm:text-lg">Powered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">Interactive Learning Experience</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Experience concepts through hands-on interaction with cutting-edge tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Visualizations Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative z-10 p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-2xl text-gray-900">Live Visualizations</CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600">
                  Watch algorithms execute step-by-step with stunning animated visualizations
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 p-4 sm:p-6 pt-0 sm:pt-0">
                <Link to="/visualizations">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-sm sm:text-base py-2 sm:py-3">
                    Try Visualizations <Play className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Code Playground Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 bg-gradient-to-br from-purple-50 to-pink-50 border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative z-10 p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Code className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-2xl text-gray-900">AI Code Playground</CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600">
                  Write, test, and execute code with AI-powered explanations and download solutions
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 p-4 sm:p-6 pt-0 sm:pt-0">
                <Link to="/playground">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-sm sm:text-base py-2 sm:py-3">
                    Open Playground <Code className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Practice Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 bg-gradient-to-br from-green-50 to-emerald-50 border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative z-10 p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-2xl text-gray-900">Practice Problems</CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600">
                  Solve coding challenges and track your progress with smart analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 p-4 sm:p-6 pt-0 sm:pt-0">
                <Link to="/practice">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-sm sm:text-base py-2 sm:py-3">
                    Start Practicing <Target className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Community Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 bg-gradient-to-br from-orange-50 to-red-50 border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative z-10 p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-2xl text-gray-900">Community Hub</CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600">
                  Connect with developers, share knowledge, collaborate and even post your ideas
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 p-4 sm:p-6 pt-0 sm:pt-0">
                <Link to="/community">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-sm sm:text-base py-2 sm:py-3">
                    Join Community <Users className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">Choose Your Learning Path</h2>
            <p className="text-lg sm:text-xl text-gray-600">Structured learning experiences tailored to your goals</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <Card className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <CardHeader className="p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <Database className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl text-gray-900">Data Structures</CardTitle>
                <CardDescription className="text-base sm:text-lg text-gray-600">
                  Master fundamental data structures with interactive visualizations and hands-on examples.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-sm sm:text-base text-gray-600">
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>Arrays & Linked Lists</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>Stacks & Queues</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>Trees & Graphs</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>Hash Tables</li>
                </ul>
                <Link to="/data-structures">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-sm sm:text-lg py-4 sm:py-6">
                    Start Learning <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <CardHeader className="p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <Cpu className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl text-gray-900">Algorithms</CardTitle>
                <CardDescription className="text-base sm:text-lg text-gray-600">
                  Understand sorting, searching, and optimization algorithms with step-by-step visualizations.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-sm sm:text-base text-gray-600">
                  <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span>Sorting Algorithms</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span>Search Algorithms</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span>Graph Algorithms</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span>Dynamic Programming</li>
                </ul>
                <Link to="/algorithms">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-sm sm:text-lg py-4 sm:py-6">
                    Explore Algorithms <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">Why Choose Algo-Forge?</h2>
            <p className="text-lg sm:text-xl text-gray-600">Experience the future of algorithm learning</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">AI-Powered Learning</h3>
              <p className="text-sm sm:text-base text-gray-600">Get personalized explanations and code analysis powered by advanced AI</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Interactive Visualizations</h3>
              <p className="text-sm sm:text-base text-gray-600">See algorithms in action with stunning, step-by-step animations</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Progress Tracking</h3>
              <p className="text-sm sm:text-base text-gray-600">Monitor your learning journey with detailed analytics and achievements</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Expert Content</h3>
              <p className="text-sm sm:text-base text-gray-600">Learn from industry-standard algorithms and best practices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 sm:mb-6">Ready to Master DSA?</h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12">Join thousands of developers who have accelerated their careers with our platform</p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Link to="/data-structures" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-sm sm:text-lg px-6 sm:px-10 py-4 sm:py-6 bg-white text-gray-900 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
                Start Learning Today
              </Button>
            </Link>
            <Link to="/demos" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm sm:text-lg px-6 sm:px-10 py-4 sm:py-6 border-white text-black hover:bg-white hover:text-gray-900 transform hover:scale-105 transition-all duration-300">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
