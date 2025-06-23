import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Hash } from 'lucide-react';

interface Topic {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface TopicsListProps {
  selectedTopicId: string | null;
  onTopicSelect: (topicId: string) => void;
}

const TopicsList: React.FC<TopicsListProps> = ({ selectedTopicId, onTopicSelect }) => {
  const { data: topics, isLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Topic[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {topics?.map(topic => (
        <button
          key={topic.id}
          onClick={() => onTopicSelect(topic.id)}
          className={`w-full text-left p-3 rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-md ${
            selectedTopicId === topic.id
              ? 'bg-blue-50 border-blue-500 shadow-md'
              : 'bg-white/80 border-gray-200 hover:bg-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-gray-500" />
            <div>
              <div className="font-medium text-gray-900">{topic.name}</div>
              {topic.description && (
                <div className="text-xs text-gray-600 mt-1">{topic.description}</div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TopicsList;