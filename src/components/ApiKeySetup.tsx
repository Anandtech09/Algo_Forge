
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Check } from 'lucide-react';

interface ApiKeySetupProps {
  onKeysSet: () => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onKeysSet }) => {
  const [groqKey, setGroqKey] = useState<string>('');
  const [openRouterKey, setOpenRouterKey] = useState<string>('');
  const [showGroqKey, setShowGroqKey] = useState<boolean>(false);
  const [showOpenRouterKey, setShowOpenRouterKey] = useState<boolean>(false);
  const [hasStoredKeys, setHasStoredKeys] = useState<boolean>(false);

  const maskApiKey = (key: string): string => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  const handleSaveKeys = (): void => {
    if (!groqKey.trim() || !openRouterKey.trim()) {
      toast({
        title: "Missing API Keys",
        description: "Please enter both Groq and OpenRouter API keys.",
        variant: "destructive",
      });
      return;
    }

    apiService.setApiKeys(groqKey.trim(), openRouterKey.trim());
    
    // Store in localStorage for persistence
    localStorage.setItem('groq_api_key', groqKey.trim());
    localStorage.setItem('openrouter_api_key', openRouterKey.trim());

    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved locally and securely.",
    });

    onKeysSet();
  };

  const handleConfirmStoredKeys = (): void => {
    const storedGroq = localStorage.getItem('groq_api_key');
    const storedOpenRouter = localStorage.getItem('openrouter_api_key');
    
    if (storedGroq && storedOpenRouter) {
      apiService.setApiKeys(storedGroq, storedOpenRouter);
      toast({
        title: "API Keys Confirmed",
        description: "Using your stored API keys for the playground.",
      });
      onKeysSet();
    }
  };

  const handleUpdateKeys = (): void => {
    setHasStoredKeys(false);
    setGroqKey('');
    setOpenRouterKey('');
  };

  const loadStoredKeys = (): void => {
    const storedGroq = localStorage.getItem('groq_api_key');
    const storedOpenRouter = localStorage.getItem('openrouter_api_key');
    
    if (storedGroq && storedOpenRouter) {
      setGroqKey(storedGroq);
      setOpenRouterKey(storedOpenRouter);
      setHasStoredKeys(true);
    }
  };

  React.useEffect(() => {
    loadStoredKeys();
  }, []);

  if (hasStoredKeys) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            API Keys Found
          </CardTitle>
          <CardDescription>
            We found stored API keys. Confirm to use them or update with new keys.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stored-groq-key">Groq API Key</Label>
            <div className="flex items-center gap-2">
              <Input
                id="stored-groq-key"
                type={showGroqKey ? "text" : "password"}
                value={showGroqKey ? groqKey : maskApiKey(groqKey)}
                readOnly
                className="bg-gray-50"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowGroqKey(!showGroqKey)}
              >
                {showGroqKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stored-openrouter-key">OpenRouter API Key</Label>
            <div className="flex items-center gap-2">
              <Input
                id="stored-openrouter-key"
                type={showOpenRouterKey ? "text" : "password"}
                value={showOpenRouterKey ? openRouterKey : maskApiKey(openRouterKey)}
                readOnly
                className="bg-gray-50"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowOpenRouterKey(!showOpenRouterKey)}
              >
                {showOpenRouterKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleConfirmStoredKeys} className="flex-1">
              <Check className="h-4 w-4 mr-2" />
              Use These Keys
            </Button>
            <Button variant="outline" onClick={handleUpdateKeys} className="flex-1">
              Update Keys
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            <p>Your API keys are stored locally and never sent to our servers.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
        <CardDescription>
          Enter your Groq and OpenRouter API keys to enable AI-powered features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="groq-key">Groq API Key</Label>
          <Input
            id="groq-key"
            type="password"
            placeholder="Enter your Groq API key"
            value={groqKey}
            onChange={(e) => setGroqKey(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
          <Input
            id="openrouter-key"
            type="password"
            placeholder="Enter your OpenRouter API key"
            value={openRouterKey}
            onChange={(e) => setOpenRouterKey(e.target.value)}
          />
        </div>

        <Button onClick={handleSaveKeys} className="w-full">
          Save API Keys
        </Button>

        <div className="text-sm text-gray-600">
          <p>Your API keys are stored locally and never sent to our servers.</p>
          <p className="mt-1">
            Get your keys from:{' '}
            <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Groq Console
            </a>{' '}
            and{' '}
            <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              OpenRouter
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeySetup;
