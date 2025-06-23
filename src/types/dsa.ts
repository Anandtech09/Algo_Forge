
export interface DataStructure {
  id: string;
  name: string;
  description: string;
  complexity: string;
  category: 'linear' | 'tree' | 'graph' | 'hash';
  code: string;
  examples?: string[];
  visualization?: boolean;
}

export interface Algorithm {
  id: string;
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'sorting' | 'searching' | 'dynamic' | 'graph' | 'greedy' | 'tree' | 'backtracking';
  code: string;
  explanation?: string;
  steps?: string[];
}

export interface CodeExecution {
  code: string;
  output: string;
  error?: string;
  timestamp: Date;
}

export interface UserProgress {
  userId: string;
  completedStructures: string[];
  completedAlgorithms: string[];
  codeExecutions: CodeExecution[];
  currentStreak: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
