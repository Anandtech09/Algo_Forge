
interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class APIService {
  private static instance: APIService;
  private groqApiKey: string = '';
  private openRouterApiKey: string = '';

  private constructor() {}

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  setApiKeys(groqKey: string, openRouterKey: string): void {
    this.groqApiKey = groqKey;
    this.openRouterApiKey = openRouterKey;
  }

  async analyzeComplexity(code: string): Promise<string> {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are a DSA expert. Analyze the code and provide ONLY time and space complexity in a concise format. Format: "Time: O(n), Space: O(1)" with brief explanation. Do not use code blocks or backticks.'
            },
            {
              role: 'user',
              content: `Analyze time and space complexity:\n\n${code}`
            }
          ],
          temperature: 0.1,
          max_tokens: 200,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GroqResponse = await response.json();
      return data.choices?.[0]?.message?.content || 'Unable to analyze complexity.';
    } catch (error) {
      console.error('Error analyzing complexity:', error);
      return 'Error analyzing complexity. Please check your Groq API key.';
    }
  }

  async explainCodeExecution(code: string): Promise<string> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'DSA Code Playground'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            {
              role: 'system',
              content: `You are an expert DSA tutor. Explain the code execution step by step:

1. ALGORITHM EXPLANATION: Describe what the algorithm does
2. STEP-BY-STEP EXECUTION: Walk through the code execution
3. TIME COMPLEXITY: Analyze time complexity with explanation
4. SPACE COMPLEXITY: Analyze space complexity with explanation  
5. OPTIMIZATION: Suggest improvements if any

Format your response clearly with numbered sections. Do not use code blocks or backticks.`
            },
            {
              role: 'user',
              content: `Explain this code step by step:\n\n${code}`
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      return data.choices?.[0]?.message?.content || 'Unable to explain code execution.';
    } catch (error) {
      console.error('Error explaining code execution:', error);
      return 'Error occurred while explaining code execution. Please check your OpenRouter API key.';
    }
  }

  async simulateCodeExecution(code: string): Promise<{ output: string; error?: string }> {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'system',
              content: `You are a Python interpreter simulator. Execute the given Python code and return EXACTLY what would be printed to the console.

Rules:
1. If there are print statements, show their output ONLY
2. If there are errors, show the Python error message
3. If the code has no output, return "No output"
4. Do not add explanations, comments, or code blocks
5. Do not use backticks or markdown formatting
6. Return only the raw console output as it would appear in Python
7. Do not include "Output:" or any prefixes`
            },
            {
              role: 'user',
              content: `Execute this Python code and return only the console output:\n\n${code}`
            }
          ],
          temperature: 0.1,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GroqResponse = await response.json();
      let output = data.choices?.[0]?.message?.content || 'No output generated.';
      
      // Clean up the output by removing code block markers
      output = output.replace(/```python\n?/g, '');
      output = output.replace(/```\n?/g, '');
      output = output.replace(/^Output:\s*/g, '');
      output = output.trim();
      
      // Check if the output contains error indicators
      if (output.toLowerCase().includes('error') || output.toLowerCase().includes('traceback')) {
        return { output: '', error: output };
      }
      
      return { output };
    } catch (error) {
      console.error('Error simulating code execution:', error);
      return { 
        output: '', 
        error: 'Error occurred during code execution simulation. Please check your API keys.' 
      };
    }
  }

  async generatePracticeProblems(dsaTopic: string): Promise<string[]> {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'system',
              content: `Generate 3 practice problems for ${dsaTopic}. Return as a JSON array of strings.`
            },
            {
              role: 'user',
              content: `Create practice problems for ${dsaTopic}`
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GroqResponse = await response.json();
      const content = data.choices?.[0]?.message?.content || '[]';
      
      try {
        return JSON.parse(content);
      } catch {
        return [content]; // Fallback if not valid JSON
      }
    } catch (error) {
      console.error('Error generating practice problems:', error);
      return ['Error generating practice problems.'];
    }
  }
}

export const apiService = APIService.getInstance();
