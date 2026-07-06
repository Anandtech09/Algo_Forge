import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code, Play, Users, Zap, Target, Award, TrendingUp, Brain, Cpu, Database, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const HeroVisualizer: React.FC = () => {
  const [array, setArray] = useState([40, 75, 25, 90, 55]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    let active = true;
    const runAnimation = async () => {
      while (active) {
        setIsSorted(false);
        let arr = [40, 75, 25, 90, 55];
        setArray([...arr]);
        await new Promise(r => setTimeout(r, 1200));

        for (let i = 0; i < arr.length; i++) {
          let swapped = false;
          for (let j = 0; j < arr.length - i - 1; j++) {
            if (!active) return;
            setComparing([j, j + 1]);
            await new Promise(r => setTimeout(r, 550));
            if (arr[j] > arr[j + 1]) {
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              setArray([...arr]);
              swapped = true;
              await new Promise(r => setTimeout(r, 550));
            }
          }
          if (!swapped) break;
        }
        setComparing([]);
        setIsSorted(true);
        await new Promise(r => setTimeout(r, 3000));
      }
    };
    runAnimation();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-slate-950/95 border border-slate-800 p-5 rounded-2xl shadow-2xl relative overflow-hidden w-full max-w-sm mx-auto backdrop-blur-md">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <span className="text-[10px] text-slate-500 font-mono tracking-wider">sorting_visualizer.py</span>
      </div>
      <div className="flex items-end justify-center gap-3.5 h-36 px-2">
        {array.map((value, idx) => {
          const isComparing = comparing.includes(idx);
          let barColor = "from-blue-600/35 to-blue-500 border-blue-400/20";
          if (isSorted) {
            barColor = "from-emerald-600/40 to-emerald-500 border-emerald-400/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
          } else if (isComparing) {
            barColor = "from-rose-600/45 to-rose-500 border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.3)] scale-105";
          }
          return (
            <div key={idx} className="flex-1 flex flex-col justify-end items-center h-full max-w-[2.2rem]">
              <div
                className={`w-full rounded-t-md transition-all duration-300 bg-gradient-to-t border ${barColor}`}
                style={{ height: `${value}%` }}
              />
              <span className={`text-[10px] mt-2 font-mono transition-colors duration-300 ${isSorted ? 'text-emerald-400' : isComparing ? 'text-rose-400' : 'text-slate-400'
                }`}>{value}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 bg-slate-900/60 border border-slate-800/60 p-2.5 rounded-lg text-center">
        <span className="text-[10px] font-mono text-slate-400">
          {isSorted ? (
            <span className="text-emerald-400">✓ Bubble Sort complete!</span>
          ) : comparing.length > 0 ? (
            <span>Comparing indices <span className="text-rose-400 font-bold">{comparing[0]}</span> and <span className="text-rose-400 font-bold">{comparing[1]}</span></span>
          ) : (
            <span>Initializing sorting array...</span>
          )}
        </span>
      </div>
    </div>
  );
};

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 text-slate-800 relative selection:bg-blue-500/10 selection:text-blue-700">
      {/* Decorative Grid Lines Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none z-0" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-400/5 rounded-full filter blur-[120px] pointer-events-none z-0" />

      {/* Fixed Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="flex justify-between items-center p-4 sm:p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-lg w-9 h-9 border border-slate-200 bg-slate-50">
              <img
                src="/images/201a1a35-a08b-41e9-8ee3-9957543b1880.png"
                alt="AlgoForge"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">AlgoForge</div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                <Link to="/community">
                  <Button variant="outline" className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm rounded-xl">
                    <Users className="mr-1.5 h-4 w-4 text-slate-500" />
                    <span>Community</span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm rounded-xl"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm rounded-xl">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 sm:pt-36 pb-16 sm:pb-24 z-10">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-8">

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                The Interactive Sandbox for{' '}
                <span className="from-blue-600 via-blue-400 to-blue-300 bg-clip-text text-transparent bg-gradient-to-r">
                  Data Structures & Algorithms
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Stop memorizing solutions. Start visualizing execution. Practice key DSA topics with real-time trace variable tracking, visual code step runs, and detailed explanation guides.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/data-structures" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transform hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-blue-500/15 rounded-xl font-semibold">
                    <Database className="mr-2 h-5 w-5" />
                    <span>Explore Structures</span>
                  </Button>
                </Link>
                <Link to="/algorithms" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 bg-blue-200 hover:bg-green-30 border border-slate-200 text-slate-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-slate-200/10 rounded-xl font-semibold">
                    <Cpu className="mr-2 h-5 w-5 text-slate-500" />
                    <span>Master Algorithms</span>
                  </Button>
                </Link>
              </div>

              {/* Stats Mini Panel */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">15+</div>
                  <div className="text-slate-500 text-xs sm:text-sm font-semibold">Data Structures</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">30+</div>
                  <div className="text-slate-500 text-xs sm:text-sm font-semibold">Algorithms</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">100+</div>
                  <div className="text-slate-500 text-xs sm:text-sm font-semibold">Problems</div>
                </div>
              </div>
            </div>

            {/* Right Sandbox Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Glow behind visualizer */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-15 animate-pulse" />
                <HeroVisualizer />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-slate-100/50 py-10 border-y border-slate-200 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-6">
            Practice for technical interviews at top engineering teams
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60 select-none">
            <span className="text-slate-500 font-extrabold tracking-tight text-lg sm:text-xl font-sans">Google</span>
            <span className="text-slate-500 font-extrabold tracking-tight text-lg sm:text-xl font-sans">Meta</span>
            <span className="text-slate-500 font-extrabold tracking-tight text-lg sm:text-xl font-sans">Microsoft</span>
            <span className="text-slate-500 font-extrabold tracking-tight text-lg sm:text-xl font-sans">Apple</span>
            <span className="text-slate-500 font-extrabold tracking-tight text-lg sm:text-xl font-sans">Netflix</span>
            <span className="text-slate-500 font-extrabold tracking-tight text-lg sm:text-xl font-sans">Amazon</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-100 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Interactive Learning Experience
            </h2>
            <p className="text-lg sm:text-xl text-slate-650 max-w-2xl mx-auto">
              Master complex data structures and interview patterns through hands-on interaction and trace debugging
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Visualizations Card */}
            <Card className="group hover:shadow-xl hover:border-slate-300 hover:bg-slate-50/20 bg-slate-50/50 border border-slate-200 rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300">
              <CardHeader className="p-6">
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-6 w-6 fill-blue-500/10 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-slate-900 font-bold mb-2">Live Visualizations</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-relaxed">
                  Watch search, sort, and graph algorithms execute step-by-step with interactive trace panels.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Link to="/visualizations">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-5 font-semibold text-sm shadow-md transition-transform hover:scale-[1.01]">
                    Open Visualizer <Play className="ml-2 h-3.5 w-3.5 fill-white text-white" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Code Playground Card */}
            <Card className="group hover:shadow-xl hover:border-slate-300 hover:bg-slate-50/20 bg-slate-50/50 border border-slate-200 rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300">
              <CardHeader className="p-6">
                <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Code className="h-6 w-6 text-purple-605" />
                </div>
                <CardTitle className="text-xl text-slate-900 font-bold mb-2">AI Code Playground</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-relaxed">
                  Run and execute Python code. Query LLM trace explanations for complexities and optimizations.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Link to="/playground">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-5 font-semibold text-sm shadow-md transition-transform hover:scale-[1.01]">
                    Open Playground <Code className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Practice Card */}
            <Card className="group hover:shadow-xl hover:border-slate-300 hover:bg-slate-50/20 bg-slate-50/50 border border-slate-200 rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300">
              <CardHeader className="p-6">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 text-emerald-605" />
                </div>
                <CardTitle className="text-xl text-slate-900 font-bold mb-2">Practice Problems</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-relaxed">
                  Practice on 100+ vetted coding challenges across Arrays, Graphs, Dynamic Programming, and Trees.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Link to="/practice">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-5 font-semibold text-sm shadow-md transition-transform hover:scale-[1.01]">
                    Start Practicing <Target className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Community Card */}
            <Card className="group hover:shadow-xl hover:border-slate-300 hover:bg-slate-50/20 bg-slate-50/50 border border-slate-200 rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300">
              <CardHeader className="p-6">
                <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-orange-605" />
                </div>
                <CardTitle className="text-xl text-slate-900 font-bold mb-2">Community Hub</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-relaxed">
                  Join real-time discussion boards and threads, review code entries, and collaborate with peers.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Link to="/community">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-5 font-semibold text-sm shadow-md transition-transform hover:scale-[1.01]">
                    Join Community <Users className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Structured Curriculums</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Tailored training paths to take you from foundational concepts to advanced interview readiness</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto">
            {/* Structures Card */}
            <Card className="hover:shadow-2xl hover:border-slate-350 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-sm">
              <div>
                <div className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <CardHeader className="p-6 sm:p-8">
                  <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <Database className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl text-slate-900 font-extrabold mb-3">01. Data Structures Blueprint</CardTitle>
                  <CardDescription className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                    Master the building blocks of memory allocation and data organization. Build physical intuition for pointers, trees, and node linkages.
                  </CardDescription>

                  <div className="h-px bg-slate-100 my-4" />

                  <div className="space-y-3.5">
                    <div className="flex items-center text-sm text-slate-650">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 shrink-0" />
                      <span>Arrays, Vectors & Linked Lists</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-655 font-medium">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 shrink-0" />
                      <span>LIFO Stack & FIFO Queue structures</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-655 font-medium">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 shrink-0" />
                      <span>Binary Trees, BSTs & AVL balancing</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-655 font-medium">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 shrink-0" />
                      <span>Adjacency lists & Matrix representations</span>
                    </div>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="p-6 sm:p-8 pt-0">
                <Link to="/data-structures">
                  <Button className="w-full bg-gradient-to-r from-blue-650 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl py-6 font-semibold">
                    Start Learning Path <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Algorithms Card */}
            <Card className="hover:shadow-2xl hover:border-slate-350 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-sm">
              <div>
                <div className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <CardHeader className="p-6 sm:p-8">
                  <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl text-slate-900 font-extrabold mb-3">02. Algorithms Mastery</CardTitle>
                  <CardDescription className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                    Learn the computational strategies to process and optimize dataset evaluation. Conquer recursion, dynamic programming, and complexity budgets.
                  </CardDescription>

                  <div className="h-px bg-slate-100 my-4" />

                  <div className="space-y-3.5">
                    <div className="flex items-center text-sm text-slate-650">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 shrink-0" />
                      <span>Sorting (Bubble, Quick, Merge, Radix)</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-655 font-medium">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 shrink-0" />
                      <span>Searching (Linear, Binary, Exponential)</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-655 font-medium">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 shrink-0" />
                      <span>Graph Traversals (BFS, DFS, Dijkstra, MSTs)</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-655 font-medium">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 shrink-0" />
                      <span>Dynamic Programming (Knapsack, LCS, Edit Distance)</span>
                    </div>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="p-6 sm:p-8 pt-0">
                <Link to="/algorithms">
                  <Button className="w-full bg-gradient-to-r from-purple-650 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl py-6 font-semibold">
                    Start Learning Path <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-100 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Engineered for Mental Models</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Traditional learning systems give you a static block of code. AlgoForge lets you trace memory state.</p>
          </div>

          <div className="max-w-4xl mx-auto border border-slate-200 rounded-2xl overflow-hidden shadow-xl bg-slate-50/50">
            <div className="grid grid-cols-2 bg-slate-900 text-white font-bold p-4 sm:p-5 text-sm sm:text-base border-b border-slate-800">
              <div>Traditional Learning</div>
              <div className="text-cyan-400">The AlgoForge Way</div>
            </div>

            <div className="divide-y divide-slate-200/80">
              <div className="grid grid-cols-2 p-4 sm:p-5 gap-4">
                <div className="text-slate-500 text-xs sm:text-sm">Static code templates that encourage rote memorization.</div>
                <div className="text-slate-800 text-xs sm:text-sm font-semibold flex items-start gap-2">
                  <span className="text-emerald-500 shrink-0 font-bold">✓</span>
                  Interactive steps that map array element swaps, pivots, and ranges live.
                </div>
              </div>

              <div className="grid grid-cols-2 p-4 sm:p-5 gap-4">
                <div className="text-slate-500 text-xs sm:text-sm">Cryptic console error dumps when debugging logic trees.</div>
                <div className="text-slate-800 text-xs sm:text-sm font-semibold flex items-start gap-2">
                  <span className="text-emerald-500 shrink-0 font-bold">✓</span>
                  AI execution trace explaining step-by-step variables and time/space complexity changes.
                </div>
              </div>

              <div className="grid grid-cols-2 p-4 sm:p-5 gap-4">
                <div className="text-slate-500 text-xs sm:text-sm">Unstructured textbook descriptions and math proofs.</div>
                <div className="text-slate-800 text-xs sm:text-sm font-semibold flex items-start gap-2">
                  <span className="text-emerald-500 shrink-0 font-bold">✓</span>
                  Playground execution environment for Python code where you can immediately verify changes.
                </div>
              </div>

              <div className="grid grid-cols-2 p-4 sm:p-5 gap-4">
                <div className="text-slate-500 text-xs sm:text-sm">Isolated practice without collaborative code feedback.</div>
                <div className="text-slate-800 text-xs sm:text-sm font-semibold flex items-start gap-2">
                  <span className="text-emerald-500 shrink-0 font-bold">✓</span>
                  Real-time developer forum threads to compare solution strategies.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400">
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

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="overflow-hidden rounded-lg w-7 h-7 border border-slate-750 bg-slate-800">
                  <img
                    src="/images/201a1a35-a08b-41e9-8ee3-9957543b1880.png"
                    alt="AlgoForge"
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">AlgoForge</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                An interactive learning sandbox designed to help engineers build strong physical intuition for algorithms and data structures.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3.5">Curriculum</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/data-structures" className="hover:text-cyan-400 transition-colors">Data Structures</Link></li>
                <li><Link to="/algorithms" className="hover:text-cyan-400 transition-colors">Algorithms</Link></li>
                <li><Link to="/practice" className="hover:text-cyan-400 transition-colors">Practice Hub</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3.5">Sandbox Tools</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/visualizations" className="hover:text-cyan-400 transition-colors">Sorting & Searching Canvas</Link></li>
                <li><Link to="/playground" className="hover:text-cyan-400 transition-colors">Interactive Code Playground</Link></li>
                <li><Link to="/community" className="hover:text-cyan-400 transition-colors">Developer Discussion Board</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3.5">Engineered with</h4>
              <p className="text-xs leading-relaxed text-slate-500 font-medium">
                React, TypeScript, Tailwind CSS, FastAPI, and powered by Groq (Llama-3.3-70b-versatile) & OpenRouter API models.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} AlgoForge. All rights reserved. Built with love for the coding community.
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;