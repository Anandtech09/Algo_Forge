import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, MessageCircle, Plus, Send, Image as ImageIcon, X, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Post {
  id: string;
  title: string;
  content: string;
  likes_count: number;
  created_at: string;
  user_id: string;
  profiles: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  post_likes: { user_id: string }[];
  comments: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: {
      username: string | null;
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  }[];
}

interface CommunityPostsProps {
  topicId: string;
}

const CommunityPosts: React.FC<CommunityPostsProps> = ({ topicId }) => {
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState<{ [postId: string]: string }>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [optimisticPosts, setOptimisticPosts] = useState<Post[]>([]);
  const [optimisticComments, setOptimisticComments] = useState<{ [postId: string]: any[] }>({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Track online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({ title: 'Online', description: 'Connected to the server.' });
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast({ title: 'Offline', description: 'No internet connection.', variant: 'destructive' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch posts
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts', topicId],
    queryFn: async () => {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('topic_id', topicId)
        .order('created_at', { ascending: false });
      
      if (postsError) {
        toast({ title: 'Error', description: 'Failed to load posts.', variant: 'destructive' });
        throw postsError;
      }

      const postsWithDetails = await Promise.all(
        postsData.map(async (post) => {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username, full_name, avatar_url')
            .eq('id', post.user_id)
            .maybeSingle();

          const { data: likes, count: likesCount } = await supabase
            .from('post_likes')
            .select('user_id', { count: 'exact' })
            .eq('post_id', post.id);

          const { data: commentsData } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', post.id)
            .order('created_at', { ascending: true });

          const commentsWithProfiles = await Promise.all(
            (commentsData || []).map(async (comment) => {
              const { data: commentProfile, error: commentProfileError } = await supabase
                .from('profiles')
                .select('username, full_name, avatar_url')
                .eq('id', comment.user_id)
                .maybeSingle();
              
              return {
                ...comment,
                profiles: commentProfileError ? null : commentProfile
              };
            })
          );
          
          return {
            ...post,
            likes_count: likesCount || 0,
            profiles: profileError ? null : profile,
            post_likes: likes || [],
            comments: commentsWithProfiles
          };
        })
      );
      
      return postsWithDetails as Post[];
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000,
  });

  // Combine real and optimistic posts
  const allPosts = React.useMemo(() => {
    const realPosts = posts || [];
    const pendingOptimistic = optimisticPosts.filter(
      optPost => !realPosts.some(post => post.id === optPost.id)
    );
    return [...pendingOptimistic, ...realPosts].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [posts, optimisticPosts]);

  // Real-time subscription
  useEffect(() => {
    if (!topicId || !isOnline) return;

    const channel = supabase
      .channel(`posts-updates-${topicId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts', filter: `topic_id=eq.${topicId}` },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, full_name, avatar_url')
              .eq('id', payload.new.user_id)
              .maybeSingle();

            const newPost = {
              ...payload.new,
              likes_count: 0,
              profiles: profile || { username: null, full_name: null, avatar_url: null },
              post_likes: [],
              comments: []
            };

            setOptimisticPosts(prev => prev.filter(post => post.id !== payload.new.id));
            queryClient.setQueryData(['posts', topicId], (old: Post[] | undefined) =>
              old ? [newPost, ...old] : [newPost]
            );
          } else if (payload.eventType === 'UPDATE') {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, full_name, avatar_url')
              .eq('id', payload.new.user_id)
              .maybeSingle();

            const updatedPost = {
              ...payload.new,
              likes_count: payload.new.likes_count || 0,
              profiles: profile || { username: null, full_name: null, avatar_url: null },
              post_likes: payload.new.post_likes || [],
              comments: payload.new.comments || []
            };

            queryClient.setQueryData(['posts', topicId], (old: Post[] | undefined) =>
              old ? old.map(post => (post.id === payload.new.id ? updatedPost : post)) : old
            );
          } else if (payload.eventType === 'DELETE') {
            queryClient.setQueryData(['posts', topicId], (old: Post[] | undefined) =>
              old ? old.filter(post => post.id !== payload.old.id) : old
            );
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments' },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, full_name, avatar_url')
              .eq('id', payload.new.user_id)
              .maybeSingle();

            const newComment = {
              ...payload.new,
              profiles: profile || { username: null, full_name: null, avatar_url: null }
            };

            setOptimisticComments(prev => ({
              ...prev,
              [payload.new.post_id]: prev[payload.new.post_id]?.filter(c => c.id !== payload.new.id) || []
            }));

            queryClient.setQueryData(['posts', topicId], (old: Post[] | undefined) => {
              if (!old) return old;
              return old.map(post => {
                if (post.id === payload.new.post_id) {
                  return { ...post, comments: [...post.comments, newComment] };
                }
                return post;
              });
            });
          } else if (payload.eventType === 'DELETE') {
            queryClient.setQueryData(['posts', topicId], (old: Post[] | undefined) => {
              if (!old) return old;
              return old.map(post => {
                if (post.id === payload.old.post_id) {
                  return { ...post, comments: post.comments.filter(c => c.id !== payload.old.id) };
                }
                return post;
              });
            });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'post_likes' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['posts', topicId] });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          toast({ title: 'Connected', description: 'Real-time posts enabled.' });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [topicId, queryClient, isOnline]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      setSelectedImages(prev => [...prev, ...imageFiles]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim() || !user || !isOnline) {
      if (!user) {
        toast({ title: 'Error', description: 'Please log in to create posts.', variant: 'destructive' });
      } else if (!isOnline) {
        toast({ title: 'Error', description: 'You are offline. Please check your connection.', variant: 'destructive' });
      }
      return;
    }

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    let imageUrls: string[] = [];

    if (selectedImages.length > 0) {
      for (const image of selectedImages) {
        const fileName = `${user.id}/${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from('post-images')
          .upload(fileName, image);

        if (!error && data) {
          const { data: { publicUrl } } = supabase.storage
            .from('post-images')
            .getPublicUrl(fileName);
          imageUrls.push(publicUrl);
        } else {
          console.error('Error uploading image:', error);
          toast({ title: 'Error', description: 'Failed to upload image.', variant: 'destructive' });
        }
      }
    }

    let finalContent = newPost.content.trim();
    if (imageUrls.length > 0) {
      finalContent += '\n\n' + imageUrls.map(url => `![Image](${url})`).join('\n');
    }

    const optimisticPost: Post = {
      id: tempId,
      title: newPost.title.trim(),
      content: finalContent,
      likes_count: 0,
      created_at: new Date().toISOString(),
      user_id: user.id,
      profiles: {
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous',
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null
      },
      post_likes: [],
      comments: []
    };

    setOptimisticPosts(prev => [optimisticPost, ...prev]);
    setNewPost({ title: '', content: '' });
    setSelectedImages([]);
    setIsCreateDialogOpen(false);

    try {
      const { error } = await supabase
        .from('posts')
        .insert([{
          topic_id: topicId,
          user_id: user.id,
          title: newPost.title.trim(),
          content: finalContent
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        setOptimisticPosts(prev => prev.filter(post => post.id !== tempId));
        toast({ title: 'Error', description: 'Failed to create post: ' + error.message, variant: 'destructive' });
        throw error;
      }

      toast({ title: 'Success', description: 'Post created successfully.' });
    } catch (error) {
      setOptimisticPosts(prev => prev.filter(post => post.id !== tempId));
    }
  };

  const getRandomColor = () => {
    const colors = [
      'blue',
      'Gray',
      'orange',
      'Tomato',
      'green',
      'pink',
      'dark',
      'skyblue',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleDeletePost = async (postId: string) => {
    if (!user || !isOnline) {
      if (!user) {
        toast({ title: 'Error', description: 'Please log in to delete posts.', variant: 'destructive' });
      } else if (!isOnline) {
        toast({ title: 'Error', description: 'You are offline. Please check your connection.', variant: 'destructive' });
      }
      return;
    }

    // Store post for potential rollback
    const postToDelete = allPosts.find(post => post.id === postId);
    if (!postToDelete) {
      console.error('Post not found for deletion:', postId);
      return;
    }

    // Optimistic delete
    queryClient.setQueryData(['posts', topicId], (oldPosts: Post[] | undefined) =>
      oldPosts ? oldPosts.filter(post => post.id !== postId) : oldPosts
    );

    try {
      // Delete associated comments
      const { error: commentsError } = await supabase
        .from('comments')
        .delete()
        .eq('post_id', postId);

      if (commentsError) {
        console.error('Error deleting comments:', commentsError);
        throw commentsError;
      }

      // Delete associated likes
      const { error: likesError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId);

      if (likesError) {
        console.error('Error deleting likes:', likesError);
        throw likesError;
      }

      // Delete the post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting post:', error, { postId, userId: user.id });
        // Rollback optimistic delete
        queryClient.setQueryData(['posts', topicId], (oldPosts: Post[] | undefined) =>
          oldPosts ? [postToDelete, ...oldPosts] : [postToDelete]
        );
        toast({ title: 'Error', description: 'Failed to delete post: ' + error.message, variant: 'destructive' });
        throw error;
      }

      toast({ title: 'Success', description: 'Post deleted successfully.' });
    } catch (error) {
      // Ensure rollback on catch
      queryClient.setQueryData(['posts', topicId], (oldPosts: Post[] | undefined) =>
        oldPosts ? [postToDelete, ...oldPosts] : [postToDelete]
      );
      toast({ title: 'Error', description: 'Failed to delete post.', variant: 'destructive' });
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user || !isOnline) {
      if (!user) {
        toast({ title: 'Error', description: 'Please log in to like posts.', variant: 'destructive' });
      } else if (!isOnline) {
        toast({ title: 'Error', description: 'You are offline. Please check your connection.', variant: 'destructive' });
      }
      return;
    }

    const post = allPosts.find(p => p.id === postId);
    if (!post) return;

    const isCurrentlyLiked = post.post_likes?.some(like => like.user_id === user.id) || false;

    queryClient.setQueryData(['posts', topicId], (oldPosts: Post[] | undefined) => {
      if (!oldPosts) return oldPosts;
      
      return oldPosts.map(p => {
        if (p.id === postId) {
          if (isCurrentlyLiked) {
            return {
              ...p,
              likes_count: Math.max(0, p.likes_count - 1),
              post_likes: p.post_likes.filter(like => like.user_id !== user.id)
            };
          } else {
            return {
              ...p,
              likes_count: p.likes_count + 1,
              post_likes: [...p.post_likes, { user_id: user.id }]
            };
          }
        }
        return p;
      });
    });

    try {
      if (isCurrentlyLiked) {
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error removing like:', error);
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('post_likes')
          .insert([{ post_id: postId, user_id: user.id }]);
        
        if (error) {
          console.error('Error adding like:', error);
          throw error;
        }
      }

      toast({ title: 'Success', description: isCurrentlyLiked ? 'Like removed.' : 'Post liked.' });
    } catch (error) {
      queryClient.invalidateQueries({ queryKey: ['posts', topicId] });
      toast({ title: 'Error', description: 'Failed to update like.', variant: 'destructive' });
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user || !isOnline) {
      if (!user) {
        toast({ title: 'Error', description: 'Please log in to add comments.', variant: 'destructive' });
      } else if (!isOnline) {
        toast({ title: 'Error', description: 'You are offline. Please check your connection.', variant: 'destructive' });
      }
      return;
    }

    const content = newComment[postId];
    if (!content?.trim()) return;

    const tempCommentId = `temp-comment-${Date.now()}-${Math.random()}`;
    const optimisticComment = {
      id: tempCommentId,
      content: content.trim(),
      created_at: new Date().toISOString(),
      user_id: user.id,
      profiles: {
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous',
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null
      }
    };

    setOptimisticComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), optimisticComment]
    }));

    setNewComment({ ...newComment, [postId]: '' });

    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          post_id: postId,
          user_id: user.id,
          content: content.trim()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        setOptimisticComments(prev => ({
          ...prev,
          [postId]: prev[postId]?.filter(comment => comment.id !== tempCommentId) || []
        }));
        toast({ title: 'Error', description: 'Failed to add comment: ' + error.message, variant: 'destructive' });
        throw error;
      }

      toast({ title: 'Success', description: 'Comment added successfully.' });
    } catch (error) {
      setOptimisticComments(prev => ({
        ...prev,
        [postId]: prev[postId]?.filter(comment => comment.id !== tempCommentId) || []
      }));
    }
  };

  const renderContent = (content: string) => {
    const parts = content.split(/!\[.*?\]\((.*?)\)/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <img 
            key={index} 
            src={part} 
            alt="Post image" 
            className="max-w-full h-auto rounded-lg mt-3"
            onError={(e) => {
              console.error('Image failed to load:', part);
              e.currentTarget.style.display = 'none';
            }}
          />
        );
      }
      return <span key={index} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  if (!user) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 shadow-xl h-[600px]">
        <CardContent className="p-8 text-center">
          <MessageCircle className="h-16 w-16 mx-auto text-blue-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Authentication Required</h3>
          <p className="text-gray-500">Please log in to view and create posts</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Create New Post
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <Input
              placeholder="Post title..."
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="border-2 border-blue-300 focus:border-green-400"
            />
            <Textarea
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              rows={4}
              className="border-2 border-blue-300 focus:border-green-400"
            />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-blue-300 hover:bg-blue-100"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Images
                </Button>
                <span className="text-sm text-gray-500">
                  {selectedImages.length} image(s) selected
                </span>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
              
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded border-2 border-blue-200"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              disabled={!newPost.title.trim() || !newPost.content.trim() || !isOnline}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              Create Post
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ScrollArea className="h-[600px] w-full bg-gradient-to-b from-blue-25 to-green-25">
        {isLoading ? (
          <div className="space-y-6 p-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-2 border-blue-200">
                <CardContent className="p-6">
                  <div className="h-6 bg-gradient-to-r from-blue-200 to-green-200 rounded w-3/4 mb-4 animate-pulse"></div>
                  <div className="h-20 bg-gradient-to-r from-blue-200 to-green-200 rounded mb-4 animate-pulse"></div>
                  <div className="flex gap-4">
                    <div className="h-8 bg-gradient-to-r from-blue-200 to-green-200 rounded w-20 animate-pulse"></div>
                    <div className="h-8 bg-gradient-to-r from-blue-200 to-green-200 rounded w-20 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="m-4 border-2 border-blue-200">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-16 w-16 mx-auto text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Posts</h3>
              <p className="text-gray-500">Failed to load posts. Please try again.</p>
              <Button
                onClick={() => queryClient.invalidateQueries({ queryKey: ['posts', topicId] })}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : allPosts.length === 0 ? (
          <Card className="m-4 border-2 border-blue-200">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-16 w-16 mx-auto text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Posts Yet</h3>
              <p className="text-gray-500">Be the first to share your thoughts!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 p-4">
            {allPosts.map((post) => {
              const isLiked = post.post_likes?.some(like => like.user_id === user?.id) || false;
              const allComments = [...post.comments, ...(optimisticComments[post.id] || [])].sort(
                (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              );
              const isOwnPost = post.user_id === user?.id;
              
              return (
                <Card key={post.id} className={`border-3 border-blue-200 ${post.id.startsWith('temp-') ? 'opacity-70' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
                          {post.profiles?.avatar_url ? (
                            <img 
                              src={post.profiles.avatar_url} 
                              alt="Avatar" 
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            (post.profiles?.username || post.profiles?.full_name || user?.email?.split('@')[0] || 'U').charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {post.profiles?.username || post.profiles?.full_name || user?.email?.split('@')[0] || 'Anonymous'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(post.created_at), 'MMM d, yyyy')}
                            {post.id.startsWith('temp-') && (
                              <span className="ml-2 text-xs text-amber-500 animate-pulse">Posting...</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {isOwnPost && !post.id.startsWith('temp-') && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 bg-white hover:bg-red-50 text-red-600 border-2 border-red-200 shadow-sm"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this post? This action cannot be undone and will also delete all associated comments and likes.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-2 border-blue-300">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeletePost(post.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                    <div className="text-gray-700 mb-4">
                      {renderContent(post.content)}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikePost(post.id)}
                        className={isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-600'}
                        disabled={post.id.startsWith('temp-') || !isOnline}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                        {post.likes_count} {post.likes_count === 1 ? 'Like' : 'Likes'}
                      </Button>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <MessageCircle className="h-4 w-4" />
                        {allComments.length} {allComments.length === 1 ? 'Comment' : 'Comments'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {allComments.map((comment) => (
                        <div key={comment.id} className={`bg-gray-50 rounded-lg p-3 border-2 border-blue-100 ${comment.id.startsWith('temp-') ? 'opacity-70' : ''}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              style={{
                                backgroundColor: getRandomColor(),
                              }}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shadow-sm"
                            >
                              {comment.profiles?.avatar_url ? (
                                <img 
                                  src={comment.profiles.avatar_url} 
                                  alt="Avatar" 
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              ) : (
                                (comment.profiles?.username || comment.profiles?.full_name || user?.email?.split('@')[0] || 'U').charAt(0).toUpperCase()
                              )}
                            </div>
                            <span className="font-medium text-sm">
                              {comment.profiles?.username || comment.profiles?.full_name || user?.email?.split('@')[0] || 'Anonymous'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(comment.created_at), 'MMM d, HH:mm')}
                              {comment.id.startsWith('temp-') && (
                                <span className="ml-2 text-xs text-amber-500 animate-pulse">Posting...</span>
                              )}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      ))}

                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a comment..."
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          disabled={post.id.startsWith('temp-') || !isOnline}
                          className="border-2 border-blue-300 focus:border-green-400"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAddComment(post.id)}
                          disabled={!newComment[post.id]?.trim() || post.id.startsWith('temp-') || !isOnline}
                          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default CommunityPosts;