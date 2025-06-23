import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, FileText, Users, ArrowLeft, Users2, Plus } from 'lucide-react';
import CommunityChat from '@/components/community/CommunityChat';
import CommunityPosts from '@/components/community/CommunityPosts';
import TopicsList from '@/components/community/TopicsList';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

const Community: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [stats, setStats] = useState({ members: 0, posts: 0, messages: 0 });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({ name: '', description: '' });
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: membersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        const { count: postsCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true });
        const { count: messagesCount } = await supabase
          .from('chat_messages')
          .select('*', { count: 'exact', head: true });

        setStats({
          members: membersCount || 0,
          posts: postsCount || 0,
          messages: messagesCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast({
          title: 'Error',
          description: 'Failed to load community stats.',
          variant: 'destructive',
        });
      }
    };

    fetchStats();
  }, []);

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopicId(topicId);
    document.getElementById('community-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.name.trim()) return;

    try {
      const { error } = await supabase
        .from('topics')
        .insert({
          name: newTopic.name.trim(),
          description: newTopic.description.trim() || null,
        });

      if (error) throw error;

      setNewTopic({ name: '', description: '' });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: 'Success',
        description: 'Topic created successfully.',
      });
    } catch (error) {
      console.error('Error creating topic:', error);
      toast({
        title: 'Error',
        description: 'Failed to create topic.',
        variant: 'destructive',
      });
    }
  };

  return (
    <ProtectedRoute message="Please log in to access the community and connect with other developers">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Fixed Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-3 text-gray-900 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">DSA Community</h1>
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
                DSA Community
              </h1>
              <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Connect, learn, and share with fellow developers in real-time
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            {/* Left Panel - Topics and Stats */}
            <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-20">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Topic
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Topic</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateTopic} className="space-y-4">
                    <div>
                      <label htmlFor="topic-name" className="text-sm font-medium text-gray-700 block mb-2">
                        Topic Name
                      </label>
                      <Input
                        id="topic-name"
                        placeholder="Enter topic name..."
                        value={newTopic.name}
                        onChange={e => setNewTopic({ ...newTopic, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="topic-description" className="text-sm font-medium text-gray-700 block mb-2">
                        Description (optional)
                      </label>
                      <Textarea
                        id="topic-description"
                        placeholder="Enter topic description..."
                        value={newTopic.description}
                        onChange={e => setNewTopic({ ...newTopic, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <Button type="submit" disabled={!newTopic.name.trim()}>
                      Create Topic
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users2 className="h-5 w-5 mr-2" />
                    Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-y-auto" style={{ maxHeight: '400px' }} id="topics-list">
                    <TopicsList
                      selectedTopicId={selectedTopicId}
                      onTopicSelect={handleTopicSelect}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Community Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-blue-500 mr-3" />
                    <div>
                      <p className="text-lg font-bold">{stats.members}</p>
                      <p className="text-sm text-gray-600">Active Members</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-green-500 mr-3" />
                    <div>
                      <p className="text-lg font-bold">{stats.posts}</p>
                      <p className="text-sm text-gray-600">Total Posts</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-6 w-6 text-purple-500 mr-3" />
                    <div>
                      <p className="text-lg font-bold">{stats.messages}</p>
                      <p className="text-sm text-gray-600">Messages Sent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Chat and Posts */}
            <div id="community-content" className="lg:col-span-7">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-xl">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      {selectedTopicId ? 'Topic Discussion' : 'Community Hub'}
                    </CardTitle>
                    {selectedTopicId && (
                      <Badge variant="outline" className="px-3 py-1">
                        Active Topic
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedTopicId ? (
                    <Tabs defaultValue="chat" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="chat" className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Live Chat
                        </TabsTrigger>
                        <TabsTrigger value="posts" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Posts
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="chat" className="mt-6">
                        <CommunityChat topicId={selectedTopicId} />
                      </TabsContent>
                      <TabsContent value="posts" className="mt-6">
                        <CommunityPosts topicId={selectedTopicId} />
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-center py-12" style={{ minHeight: '728px' }}>
                      <Users className="h-16 w-16 mx-auto text-gray-400" style={{ minHeight: '130px' }}/>
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">Get Started</h3>
                      <p className="text-gray-500 mb-4">
                        Select a topic from the sidebar to join the conversation or browse community posts.
                      </p>
                      <Button
                        variant="default"
                        onClick={() => document.getElementById('topics-list')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        Explore Topics
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Community;