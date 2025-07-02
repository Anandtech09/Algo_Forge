import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle, Smile, Edit2, Check, X, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Profile {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

interface ChatMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  topic_id: string;
  profiles: Profile | null;
}

interface OptimisticMessage extends ChatMessage {
  isOptimistic?: boolean;
  status?: 'sending' | 'sent' | 'failed';
}

interface CommunityChatProps {
  topicId: string;
}

const CommunityChat: React.FC<CommunityChatProps> = ({ topicId }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch current user's profile
  const { data: userProfile, error: profileError } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle();
      if (error) {
        console.error('Profile fetch error:', error.message);
        toast({ title: 'Error', description: 'Failed to load user profile.', variant: 'destructive' });
        return null;
      }
      return data as Profile | null;
    },
    enabled: !!user,
  });

  const emojiSet = [
    '😀', '😃', '😄', '😊', '😍', '🥰', '😘', '😗',
    '😂', '🤣', '😅', '😆', '😉', '😋', '😎', '😏',
    '🥳', '🤓', '😇', '🥺', '😢', '😭', '😤', '😡',
    '😱', '😨', '😰', '😥', '😴', '🤗', '🤔', '🤨',
    '🙂', '🙃', '😶', '😣', '😖', '😫', '😩', '🥱',
    '😜', '😝', '😛', '😬', '🙄', '😈', '💀', '👻',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🙌', '👏',
    '❤️', '💔', '💕', '💖', '💗', '💞', '💘', '💝',
    '⭐', '🌟', '✨', '💥', '🔥', '🌈', '☀️', '🌙',
    '🎉', '🎈', '🎁', '🎀', '🎂', '🍾', '🥂', '🎄'
  ];

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

  // Fetch messages
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['chat-messages', topicId],
    queryFn: async () => {
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        toast({ title: 'Error', description: 'Failed to load messages.', variant: 'destructive' });
        throw messagesError;
      }

      const messagesWithProfiles = await Promise.all(
        messagesData.map(async (msg) => {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('username, full_name, avatar_url')
            .eq('id', msg.user_id)
            .maybeSingle();

          return {
            ...msg,
            profiles: error || !profile
              ? { username: null, full_name: null, avatar_url: null }
              : profile,
          };
        })
      );

      return messagesWithProfiles as ChatMessage[];
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000,
  });

  // Combine real and optimistic messages
  const allMessages = React.useMemo(() => {
    const realMessages = messages || [];
    const pendingOptimistic = optimisticMessages.filter(
      optMsg => !realMessages.some(msg => msg.id === optMsg.id)
    );
    return [...realMessages, ...pendingOptimistic].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [messages, optimisticMessages]);

  // Real-time subscription
  useEffect(() => {
    if (!topicId || !isOnline) return;

    const channel = supabase
      .channel(`chat-messages-${topicId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_messages', filter: `topic_id=eq.${topicId}` },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, full_name, avatar_url')
              .eq('id', payload.new.user_id)
              .maybeSingle();

            const newMessage = {
              ...payload.new,
              profiles: profile || { username: null, full_name: null, avatar_url: null },
            };

            setOptimisticMessages(prev => prev.filter(msg => msg.id !== payload.new.id));
            queryClient.setQueryData(['chat-messages', topicId], (old: ChatMessage[] | undefined) =>
              old ? [...old, newMessage] : [newMessage]
            );
          } else if (payload.eventType === 'UPDATE') {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, full_name, avatar_url')
              .eq('id', payload.new.user_id)
              .maybeSingle();

            const updatedMessage = {
              ...payload.new,
              profiles: profile || { username: null, full_name: null, avatar_url: null },
            };

            queryClient.setQueryData(['chat-messages', topicId], (old: ChatMessage[] | undefined) =>
              old ? old.map(msg => (msg.id === payload.new.id ? updatedMessage : msg)) : old
            );
          } else if (payload.eventType === 'DELETE') {
            queryClient.setQueryData(['chat-messages', topicId], (old: ChatMessage[] | undefined) =>
              old ? old.filter(msg => msg.id !== payload.old.id) : old
            );
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          toast({ title: 'Connected', description: 'Real-time chat enabled.' });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [topicId, queryClient, isOnline]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || !isOnline) {
      if (!user) {
        toast({ title: 'Error', description: 'Please log in to send messages.', variant: 'destructive' });
      } else if (!isOnline) {
        toast({ title: 'Error', description: 'You are offline. Please check your connection.', variant: 'destructive' });
      }
      return;
    }

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const messageContent = message.trim();
    const username = userProfile?.username || user.email?.split('@')[0] || 'Anonymous';

    const optimisticMessage: OptimisticMessage = {
      id: tempId,
      content: messageContent,
      created_at: new Date().toISOString(),
      user_id: user.id,
      topic_id: topicId,
      profiles: {
        username,
        full_name: userProfile?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
      },
      isOptimistic: true,
      status: 'sending',
    };

    setOptimisticMessages(prev => [...prev, optimisticMessage]);
    setMessage('');
    setShowEmojiPicker(false);

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          topic_id: topicId,
          user_id: user.id,
          content: messageContent,
        })
        .select()
        .single();

      if (error) {
        setOptimisticMessages(prev =>
          prev.map(msg =>
            msg.id === tempId ? { ...msg, status: 'failed' } : msg
          )
        );
        toast({ title: 'Error', description: 'Failed to send message: ' + error.message, variant: 'destructive' });
        throw error;
      }

      setOptimisticMessages(prev =>
        prev.map(msg =>
          msg.id === tempId
            ? { ...data, profiles: { username, full_name: userProfile?.full_name || null, avatar_url: user.user_metadata?.avatar_url || null }, status: 'sent' }
            : msg
        )
      );
      setTimeout(() => {
        setOptimisticMessages(prev => prev.filter(msg => msg.id !== tempId));
      }, 1000);
      toast({ title: 'Success', description: 'Message sent successfully.' });
    } catch (error) {
      setOptimisticMessages(prev =>
        prev.map(msg =>
          msg.id === tempId ? { ...msg, status: 'failed' } : msg
        )
      );
    }
  };

  const handleEditMessage = async (messageId: string) => {
    if (!editContent.trim() || !user || !isOnline) {
      if (!user) {
        toast({ title: 'Error', description: 'Please log in to edit messages.', variant: 'destructive' });
      } else if (!isOnline) {
        toast({ title: 'Error', description: 'You are offline. Please check your connection.', variant: 'destructive' });
      }
      return;
    }

    // Optimistic update
    queryClient.setQueryData(['chat-messages', topicId], (oldMessages: ChatMessage[] | undefined) => {
      if (!oldMessages) return oldMessages;
      return oldMessages.map(msg =>
        msg.id === messageId ? { ...msg, content: editContent.trim() } : msg
      );
    });

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .update({ content: editContent.trim() })
        .eq('id', messageId)
        .eq('user_id', user.id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Update error:', error.message);
        queryClient.invalidateQueries({ queryKey: ['chat-messages', topicId] });
        toast({ title: 'Error', description: 'Failed to update message: ' + error.message, variant: 'destructive' });
        throw error;
      }

      if (!data) {
        console.error('No message found for update:', { messageId, userId: user.id });
        queryClient.invalidateQueries({ queryKey: ['chat-messages', topicId] });
        toast({ title: 'Error', description: 'Message not found or unauthorized.', variant: 'destructive' });
        return;
      }

      // Update cache with server response
      queryClient.setQueryData(['chat-messages', topicId], (oldMessages: ChatMessage[] | undefined) => {
        if (!oldMessages) return oldMessages;
        return oldMessages.map(msg =>
          msg.id === messageId ? { ...msg, content: data.content, created_at: data.created_at } : msg
        );
      });

      setEditingMessage(null);
      setEditContent('');
      toast({ title: 'Success', description: 'Message updated successfully.' });
    } catch (error) {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', topicId] });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!user || !isOnline) {
      if (!user) {
        toast({ title: 'Error', description: 'Please log in to delete messages.', variant: 'destructive' });
      } else if (!isOnline) {
        toast({ title: 'Error', description: 'You are offline. Please check your connection.', variant: 'destructive' });
      }
      return;
    }

    // Store message for potential rollback
    const messageToDelete = allMessages.find(msg => msg.id === messageId);
    if (!messageToDelete) return;

    // Optimistic delete
    queryClient.setQueryData(['chat-messages', topicId], (oldMessages: ChatMessage[] | undefined) =>
      oldMessages ? oldMessages.filter(msg => msg.id !== messageId) : oldMessages
    );

    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Delete error:', error.message);
        // Rollback optimistic delete
        queryClient.setQueryData(['chat-messages', topicId], (oldMessages: ChatMessage[] | undefined) =>
          oldMessages ? [...oldMessages, messageToDelete] : [messageToDelete]
        );
        toast({ title: 'Error', description: 'Failed to delete message: ' + error.message, variant: 'destructive' });
        throw error;
      }

      toast({ title: 'Success', description: 'Message deleted successfully.' });
    } catch (error) {
      // Ensure rollback on catch
      queryClient.setQueryData(['chat-messages', topicId], (oldMessages: ChatMessage[] | undefined) =>
        oldMessages ? [...oldMessages, messageToDelete] : [messageToDelete]
      );
    }
  };

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const startEditing = (message: ChatMessage) => {
    setEditingMessage(message.id);
    setEditContent(message.content);
  };

  const cancelEditing = () => {
    setEditingMessage(null);
    setEditContent('');
  };

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const formatMessageContent = (content: string) => {
    const words = content.split(' ');
    return words.map((word, index) => {
      if (isUrl(word)) {
        return (
          <a
            key={index}
            href={word}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            {word}
          </a>
        );
      }
      return word + ' ';
    });
  };

  const getStatusIndicator = (msg: OptimisticMessage) => {
    if (!msg.isOptimistic) return null;
    switch (msg.status) {
      case 'sending':
        return <span className="text-xs text-amber-500 animate-pulse">Sending...</span>;
      case 'sent':
        return <span className="text-xs text-green-500">✓ Sent</span>;
      case 'failed':
        return <span className="text-xs text-red-500">✗ Failed</span>;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 shadow-xl h-[600px]">
        <CardContent className="p-8 text-center">
          <MessageCircle className="h-16 w-16 mx-auto text-blue-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Authentication Required</h3>
          <p className="text-gray-500">Please log in to participate in chat discussions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 shadow-xl h-[665px] flex flex-col">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Live Chat
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-25 to-green-25">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-300 to-green-300 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gradient-to-r from-blue-200 to-green-200 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gradient-to-r from-blue-200 to-green-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error || profileError ? (
            <div className="text-center text-red-500 py-8">
              <MessageCircle className="h-16 w-16 mx-auto mb-4" />
              <p>Failed to load messages or profile. Please refresh the page.</p>
              <Button
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ['chat-messages', topicId] });
                  queryClient.invalidateQueries({ queryKey: ['user-profile', user.id] });
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Retry
              </Button>
            </div>
          ) : allMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-blue-300" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            allMessages.map(msg => {
              const isOwnMessage = msg.user_id === user?.id;
              const isEditing = editingMessage === msg.id;
              const isOptimistic = 'isOptimistic' in msg && msg.isOptimistic;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} transition-opacity duration-300 group ${
                    isOptimistic ? 'opacity-70' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 shadow-md bg-green-500">
                    {msg.profiles?.avatar_url ? (
                      <img
                        src={msg.profiles.avatar_url}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      (msg.profiles?.username || user?.email?.split('@')[0] || 'U').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className={`flex-1 min-w-0 max-w-[70%] ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="font-medium text-sm text-gray-900">
                        {msg.profiles?.username || user?.email?.split('@')[0] || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(msg.created_at), 'MMM d, HH:mm')}
                      </span>
                      {getStatusIndicator(msg)}
                    </div>
                    <div className={`flex items-start gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div
                        className={`rounded-lg p-3 shadow-md border-2 break-words ${
                          isOwnMessage
                            ? 'bg-gray-800 text-white border-gray-600'
                            : 'bg-white text-gray-800 border-gray-200'
                        }`}
                        style={{
                          minWidth: 'fit-content',
                          maxWidth: '100%',
                          width: 'auto',
                          display: 'inline-block',
                        }}
                      >
                        {isEditing ? (
                          <div className="space-y-2 min-w-[200px]">
                            <Input
                              value={editContent}
                              onChange={e => setEditContent(e.target.value)}
                              onKeyPress={e => e.key === 'Enter' && handleEditMessage(msg.id)}
                              className="text-sm bg-white text-gray-800 border-2 border-gray-300"
                              autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                onClick={() => handleEditMessage(msg.id)}
                                className="bg-green-600 hover:bg-green-700"
                                disabled={!editContent.trim()}
                              >
                                <Check className="h-3 w-3" /> Update
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEditing}
                                className="border-2 bg-red-700"
                              >
                                <X className="h-3 w-3" /> Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>{formatMessageContent(msg.content)}</div>
                        )}
                      </div>
                      {isOwnMessage && !isOptimistic && !isEditing && (
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditing(msg)}
                            className="h-6 w-6 p-0 bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-200 shadow-sm"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="h-6 w-6 p-0 bg-white hover:bg-red-50 text-red-600 border-2 border-red-200 shadow-sm"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t-2 border-blue-200 bg-gradient-to-r from-blue-50 to-green-50 p-4 flex-shrink-0">
          <form onSubmit={handleSendMessage} className="relative">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="pr-12 border-2 border-blue-300 focus:border-green-400 bg-white"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-blue-600 hover:bg-blue-100"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Button
                type="submit"
                disabled={!message.trim() || !isOnline}
                className="px-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 bg-white border-2 border-blue-300 rounded-lg shadow-xl p-3 grid grid-cols-8 gap-2 z-10 max-h-64 overflow-y-auto">
                {emojiSet.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => addEmoji(emoji)}
                    className="text-xl hover:bg-gradient-to-br hover:from-blue-100 hover:to-green-100 p-2 rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityChat;