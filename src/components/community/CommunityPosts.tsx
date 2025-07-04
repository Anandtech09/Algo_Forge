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
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter
} from '@/components/ui/alert-dialog';

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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const POSTS_STORAGE_KEY = `posts_${topicId}`;
  const COMMENTS_STORAGE_KEY = `comments_${topicId}`;
  const LIKES_STORAGE_KEY = `likes_${topicId}`;

  const getStoredPosts = (): Post[] => {
    const stored = localStorage.getItem(POSTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const savePostsToStorage = (posts: Post[]) => {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  };

  const getStoredComments = (): { [postId: string]: Post['comments'] } => {
    const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  const saveCommentsToStorage = (comments: { [postId: string]: Post['comments'] }) => {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  };

  const getStoredLikes = (): { [postId: string]: { user_id: string }[] } => {
    const stored = localStorage.getItem(LIKES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  const saveLikesToStorage = (likes: { [postId: string]: { user_id: string }[] }) => {
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likes));
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({ title: 'Online', description: 'Connected to the server.' });
      queryClient.invalidateQueries({ queryKey: ['posts', topicId] });
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
  }, [queryClient, topicId]);

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
                profiles: commentProfileError ? null : commentProfile,
              };
            })
          );

          return {
            ...post,
            likes_count: likesCount || 0,
            profiles: profileError ? null : profile,
            post_likes: likes || [],
            comments: commentsWithProfiles,
          };
        })
      );

      savePostsToStorage(postsWithDetails);
      saveCommentsToStorage(
        postsWithDetails.reduce((acc, post) => ({
          ...acc,
          [post.id]: post.comments,
        }), {})
      );
      saveLikesToStorage(
        postsWithDetails.reduce((acc, post) => ({
          ...acc,
          [post.id]: post.post_likes,
        }), {})
      );

      return postsWithDetails as Post[];
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000,
  });

  const allPosts = React.useMemo(() => {
    const storedPosts = getStoredPosts();
    return storedPosts.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [posts]);

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
              comments: [],
            };

            const updatedPosts = [newPost, ...getStoredPosts().filter(post => post.id !== payload.new.id)];
            savePostsToStorage(updatedPosts);
            queryClient.setQueryData(['posts', topicId], updatedPosts);
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
              comments: payload.new.comments || [],
            };

            const updatedPosts = getStoredPosts().map(post =>
              post.id === payload.new.id ? updatedPost : post
            );
            savePostsToStorage(updatedPosts);
            queryClient.setQueryData(['posts', topicId], updatedPosts);
          } else if (payload.eventType === 'DELETE') {
            const updatedPosts = getStoredPosts().filter(post => post.id !== payload.old.id);
            savePostsToStorage(updatedPosts);
            queryClient.setQueryData(['posts', topicId], updatedPosts);
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
              profiles: profile || { username: null, full_name: null, avatar_url: null },
            };

            const storedComments = getStoredComments();
            const postComments = storedComments[payload.new.post_id] || [];
            storedComments[payload.new.post_id] = [
              ...postComments.filter(c => c.id !== payload.new.id),
              newComment,
            ];
            saveCommentsToStorage(storedComments);

            const updatedPosts = getStoredPosts().map(post => {
              if (post.id === payload.new.post_id) {
                return { ...post, comments: storedComments[payload.new.post_id] };
              }
              return post;
            });
            savePostsToStorage(updatedPosts);
            queryClient.setQueryData(['posts', topicId], updatedPosts);
          } else if (payload.eventType === 'DELETE') {
            const storedComments = getStoredComments();
            storedComments[payload.old.post_id] = storedComments[payload.old.post_id]?.filter(
              c => c.id !== payload.old.id
            ) || [];
            saveCommentsToStorage(storedComments);

            const updatedPosts = getStoredPosts().map(post => {
              if (post.id === payload.old.post_id) {
                return { ...post, comments: storedComments[payload.old.post_id] };
              }
              return post;
            });
            savePostsToStorage(updatedPosts);
            queryClient.setQueryData(['posts', topicId], updatedPosts);
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

  const newPostData: Post = {
    id: tempId,
    title: newPost.title.trim(),
    content: finalContent,
    likes_count: 0,
    created_at: new Date().toISOString(),
    user_id: user.id,
    profiles: {
      username: user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous',
      full_name: user.user_metadata?.full_name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
    },
    post_likes: [],
    comments: [],
  };

  // Update local storage
  const updatedPosts = [newPostData, ...getStoredPosts()];
  savePostsToStorage(updatedPosts);
  queryClient.setQueryData(['posts', topicId], updatedPosts);

  // Clear dialog inputs
  setNewPost({ title: '', content: '' });
  setSelectedImages([]);
  setIsCreateDialogOpen(false);

  // Sync with Supabase in the background
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        topic_id: topicId,
        user_id: user.id,
        title: newPost.title.trim(),
        content: finalContent,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      // Rollback local storage on error
      savePostsToStorage(getStoredPosts().filter(post => post.id !== tempId));
      queryClient.setQueryData(['posts', topicId], getStoredPosts());
      toast({ title: 'Error', description: 'Failed to create post: ' + error.message, variant: 'destructive' });
      throw error;
    }

    // Update local storage with real post ID
    const realPost = {
      ...newPostData,
      id: data.id,
      created_at: data.created_at,
    };
    savePostsToStorage(getStoredPosts().map(post => (post.id === tempId ? realPost : post)));
    queryClient.setQueryData(['posts', topicId], getStoredPosts());
    toast({ title: 'Success', description: 'Post created successfully.' });
  } catch (error) {
    console.error('Error syncing post with database:', error);
  }
};

  const getRandomColor = () => {
    const colors = ['blue', 'gray', 'orange', 'tomato', 'green', 'pink', 'dark', 'skyblue'];
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

    // Store post for rollback
    const postToDelete = getStoredPosts().find(post => post.id === postId);
    if (!postToDelete) {
      console.error('Post not found for deletion:', postId);
      return;
    }

    // Update local storage
    const updatedPosts = getStoredPosts().filter(post => post.id !== postId);
    savePostsToStorage(updatedPosts);
    queryClient.setQueryData(['posts', topicId], updatedPosts);

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
        // Rollback
        savePostsToStorage([postToDelete, ...getStoredPosts()]);
        queryClient.setQueryData(['posts', topicId], getStoredPosts());
        toast({ title: 'Error', description: 'Failed to delete post: ' + error.message, variant: 'destructive' });
        throw error;
      }

      // Update comments and likes storage
      const storedComments = getStoredComments();
      delete storedComments[postId];
      saveCommentsToStorage(storedComments);
      const storedLikes = getStoredLikes();
      delete storedLikes[postId];
      saveLikesToStorage(storedLikes);

      toast({ title: 'Success', description: 'Post deleted successfully.' });
    } catch (error) {
      // Rollback on error
      savePostsToStorage([postToDelete, ...getStoredPosts()]);
      queryClient.setQueryData(['posts', topicId], getStoredPosts());
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

    const post = getStoredPosts().find(p => p.id === postId);
    if (!post) return;

    const storedLikes = getStoredLikes();
    const postLikes = storedLikes[postId] || [];
    const isCurrentlyLiked = postLikes.some(like => like.user_id === user.id);

    // Update local storage
    if (isCurrentlyLiked) {
      storedLikes[postId] = postLikes.filter(like => like.user_id !== user.id);
      saveLikesToStorage(storedLikes);
      const updatedPosts = getStoredPosts().map(p =>
        p.id === postId ? { ...p, likes_count: Math.max(0, p.likes_count - 1), post_likes: storedLikes[postId] } : p
      );
      savePostsToStorage(updatedPosts);
      queryClient.setQueryData(['posts', topicId], updatedPosts);
    } else {
      storedLikes[postId] = [...postLikes, { user_id: user.id }];
      saveLikesToStorage(storedLikes);
      const updatedPosts = getStoredPosts().map(p =>
        p.id === postId ? { ...p, likes_count: p.likes_count + 1, post_likes: storedLikes[postId] } : p
      );
      savePostsToStorage(updatedPosts);
      queryClient.setQueryData(['posts', topicId], updatedPosts);
    }

    // Sync with Supabase
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
      // Rollback
      const rollbackLikes = getStoredLikes();
      if (isCurrentlyLiked) {
        rollbackLikes[postId] = [...postLikes, { user_id: user.id }];
      } else {
        rollbackLikes[postId] = postLikes.filter(like => like.user_id !== user.id);
      }
      saveLikesToStorage(rollbackLikes);
      const rollbackPosts = getStoredPosts().map(p =>
        p.id === postId
          ? { ...p, likes_count: isCurrentlyLiked ? p.likes_count + 1 : Math.max(0, p.likes_count - 1), post_likes: rollbackLikes[postId] }
          : p
      );
      savePostsToStorage(rollbackPosts);
      queryClient.setQueryData(['posts', topicId], rollbackPosts);
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
    const newCommentData = {
      id: tempCommentId,
      content: content.trim(),
      created_at: new Date().toISOString(),
      user_id: user.id,
      profiles: {
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous',
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
      },
    };

    // Update local storage
    const storedComments = getStoredComments();
    storedComments[postId] = [...(storedComments[postId] || []), newCommentData];
    saveCommentsToStorage(storedComments);
    const updatedPosts = getStoredPosts().map(post =>
      post.id === postId ? { ...post, comments: storedComments[postId] } : post
    );
    savePostsToStorage(updatedPosts);
    queryClient.setQueryData(['posts', topicId], updatedPosts);

    setNewComment({ ...newComment, [postId]: '' });

    // Sync with Supabase
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          post_id: postId,
          user_id: user.id,
          content: content.trim(),
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        // Remove from local storage on error
        storedComments[postId] = storedComments[postId].filter(c => c.id !== tempCommentId);
        saveCommentsToStorage(storedComments);
        const rollbackPosts = getStoredPosts().map(post =>
          post.id === postId ? { ...post, comments: storedComments[postId] } : post
        );
        savePostsToStorage(rollbackPosts);
        queryClient.setQueryData(['posts', topicId], rollbackPosts);
        toast({ title: 'Error', description: 'Failed to add comment: ' + error.message, variant: 'destructive' });
        throw error;
      }

      // Update local storage with real comment ID
      storedComments[postId] = storedComments[postId].map(c =>
        c.id === tempCommentId ? { ...c, id: data.id, created_at: data.created_at } : c
      );
      saveCommentsToStorage(storedComments);
      const updatedPostsWithRealComment = getStoredPosts().map(post =>
        post.id === postId ? { ...post, comments: storedComments[postId] } : post
      );
      savePostsToStorage(updatedPostsWithRealComment);
      queryClient.setQueryData(['posts', topicId], updatedPostsWithRealComment);
      toast({ title: 'Success', description: 'Comment added successfully.' });
    } catch (error) {
      console.error('Error syncing comment with database:', error);
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
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) {
            setNewPost({ title: '', content: '' });
            setSelectedImages([]);
          }
        }}
      >
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
              const isLiked = (getStoredLikes()[post.id] || []).some(like => like.user_id === user?.id);
              const allComments = (getStoredComments()[post.id] || []).sort(
                (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              );
              const isOwnPost = post.user_id === user?.id;

              return (
                <Card key={post.id} className="border-3 border-blue-200">
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
                    <div className="text-gray-700 mb-4">{renderContent(post.content)}</div>
                    <div className="flex items-center gap-4 mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikePost(post.id)}
                        className={isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-600'}
                        disabled={!isOnline}
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
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-3 border-2 border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              style={{ backgroundColor: getRandomColor() }}
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
                          disabled={!isOnline}
                          className="border-2 border-blue-300 focus:border-green-400"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAddComment(post.id)}
                          disabled={!newComment[post.id]?.trim() || !isOnline}
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