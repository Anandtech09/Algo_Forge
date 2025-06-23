
import { supabase } from '@/integrations/supabase/client';

export interface PracticeProgress {
  problem_id: string;
  completed: boolean;
  completed_at?: string;
}

const STORAGE_KEY = 'practice_progress';

// Get progress from localStorage
export const getLocalProgress = (): Record<string, boolean> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Save progress to localStorage
export const saveLocalProgress = (problemId: string, completed: boolean) => {
  try {
    const current = getLocalProgress();
    current[problemId] = completed;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// Save progress to database
export const savePracticeProgress = async (problemId: string, completed: boolean) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Save to localStorage if not authenticated
      saveLocalProgress(problemId, completed);
      return;
    }

    // Save to both localStorage and database
    saveLocalProgress(problemId, completed);

    const progressData = {
      user_id: user.id,
      problem_id: problemId,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('practice_progress')
      .upsert(progressData, {
        onConflict: 'user_id,problem_id'
      });

    if (error) {
      console.error('Failed to save progress to database:', error);
    }
  } catch (error) {
    console.error('Error saving practice progress:', error);
  }
};

// Load progress from database and sync with localStorage
export const loadPracticeProgress = async (): Promise<Record<string, boolean>> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Return localStorage data if not authenticated
      return getLocalProgress();
    }

    // Fetch from database
    const { data: dbProgress, error } = await supabase
      .from('practice_progress')
      .select('problem_id, completed')
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to load progress from database:', error);
      return getLocalProgress();
    }

    // Convert database format to our format
    const progress: Record<string, boolean> = {};
    dbProgress?.forEach(item => {
      progress[item.problem_id] = item.completed;
    });

    // Merge with localStorage (database takes precedence)
    const localProgress = getLocalProgress();
    const mergedProgress = { ...localProgress, ...progress };

    // Update localStorage with merged data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedProgress));

    return mergedProgress;
  } catch (error) {
    console.error('Error loading practice progress:', error);
    return getLocalProgress();
  }
};

// Check if a specific problem is completed
export const isProblemCompleted = async (problemId: string): Promise<boolean> => {
  const progress = await loadPracticeProgress();
  return progress[problemId] || false;
};
