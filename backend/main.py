from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import requests
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY") or os.getenv("VITE_GROQ_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY") or os.getenv("VITE_OPENROUTER_API_KEY")

GROQ_MODELS = [
    "qwen/qwen3.8-27b",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b"
]

OPENROUTER_MODELS = [
    "meta-llama/llama-3.1-8b-instruct",
    "meta-llama/llama-3.3-70b-instruct",
    "qwen/qwen-2.5-coder-32b-instruct"
]

def call_groq_api(messages: list, temperature: float = 0.1, max_tokens: int = 1000) -> dict:
    if not GROQ_API_KEY:
        raise ValueError("GROQ API key is missing")
        
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    last_err = None
    for model in GROQ_MODELS:
        try:
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json={
                    "model": model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                },
                timeout=30
            )
            if response.status_code == 200:
                return response.json()
            else:
                last_err = f"Status {response.status_code}: {response.text}"
                logger.warning(f"Groq model {model} failed: {last_err}")
        except Exception as e:
            last_err = str(e)
            logger.warning(f"Groq request exception for model {model}: {last_err}")
            
    raise requests.exceptions.HTTPError(f"All Groq models failed. Last error: {last_err}")

def call_openrouter_api(messages: list, temperature: float = 0.3, max_tokens: int = 2000) -> dict:
    if not OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER API key is missing")
        
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://algo-forge-ashy.vercel.app",
        "X-Title": "DSA Code Playground"
    }
    last_err = None
    for model in OPENROUTER_MODELS:
        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json={
                    "model": model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                },
                timeout=30
            )
            if response.status_code == 200:
                return response.json()
            else:
                last_err = f"Status {response.status_code}: {response.text}"
                logger.warning(f"OpenRouter model {model} failed: {last_err}")
        except Exception as e:
            last_err = str(e)
            logger.warning(f"OpenRouter request exception for model {model}: {last_err}")
            
    raise requests.exceptions.HTTPError(f"All OpenRouter models failed. Last error: {last_err}")

class CodeRequest(BaseModel):
    code: str

class PracticeRequest(BaseModel):
    dsa_topic: str

class ExecutionResponse(BaseModel):
    output: str
    error: Optional[str] = None

@app.get("/health")
async def health_check():
    if not GROQ_API_KEY or not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="API keys are not configured")
    return {"status": "healthy"}

@app.post("/execute", response_model=ExecutionResponse)
async def execute_code(request: CodeRequest):
    try:
        messages = [
            {
                "role": "system",
                "content": """You are a Python interpreter simulator. Execute the given Python code and return EXACTLY what would be printed to the console.

Rules:
1. If there are print statements, show their output ONLY
2. If there are errors, show the Python error message
3. If the code has no output, return empty string
4. Do not add explanations, comments, or code blocks
5. Do not use backticks or markdown formatting
6. Return only the raw console output as it would appear in Python
7. Do not include "Output:" or any prefixes"""
            },
            {
                "role": "user",
                "content": f"Execute this Python code and return only the console output:\n\n{request.code}"
            }
        ]
        
        data = call_groq_api(messages, temperature=0.1, max_tokens=1000)
        
        output = data["choices"][0]["message"]["content"].strip()
        output = output.replace("```python\n", "").replace("```\n", "").replace("Output:", "").strip()
        
        if "error" in output.lower() or "traceback" in output.lower():
            return ExecutionResponse(output="", error=output)
        
        return ExecutionResponse(output=output or "No output generated.")
    except requests.exceptions.HTTPError as http_err:
        logger.error(f"HTTP error in /execute: {http_err}")
        return ExecutionResponse(
            output="",
            error=f"HTTP error during code execution: {str(http_err)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in /execute: {e}")
        return ExecutionResponse(
            output="",
            error=f"Unexpected error during code execution: {str(e)}"
        )

@app.post("/analyze")
async def analyze_code(request: CodeRequest):
    try:
        messages = [
            {
                "role": "system",
                "content": """You are a DSA expert. Analyze the code and provide ONLY time and space complexity in a concise format. Format: "Time: O(n), Space: O(1)" with brief explanation. Do not use code blocks or backticks."""
            },
            {
                "role": "user",
                "content": f"Analyze time and space complexity:\n\n{request.code}"
            }
        ]
        
        data = call_groq_api(messages, temperature=0.1, max_tokens=200)
        return {"analysis": data["choices"][0]["message"]["content"] or "Unable to analyze complexity."}
    except requests.exceptions.HTTPError as http_err:
        logger.error(f"HTTP error in /analyze: {http_err}")
        return {"analysis": f"HTTP error analyzing complexity: {str(http_err)}"}
    except Exception as e:
        logger.error(f"Unexpected error in /analyze: {e}")
        return {"analysis": f"Unexpected error analyzing complexity: {str(e)}"}

@app.post("/explain")
async def explain_code(request: CodeRequest):
    messages = [
        {
            "role": "system",
            "content": """You are an expert DSA tutor. Explain the code execution step by step:

1. ALGORITHM EXPLANATION: Describe what the algorithm does
2. STEP-BY-STEP EXECUTION: Walk through the code execution
3. TIME COMPLEXITY: Analyze time complexity with explanation
4. SPACE COMPLEXITY: Analyze space complexity with explanation  
5. OPTIMIZATION: Suggest improvements if any

Format your response clearly with numbered sections. Do not use code blocks or backticks."""
        },
        {
            "role": "user",
            "content": f"Explain this code step by step:\n\n{request.code}"
        }
    ]
    try:
        data = call_openrouter_api(messages, temperature=0.3, max_tokens=2000)
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "Unable to explain code execution.")
        return {"explanation": content}
    except Exception as openrouter_err:
        logger.error(f"OpenRouter failed in /explain: {openrouter_err}")
        # Fallback to Groq API if OpenRouter fails
        try:
            logger.info("Falling back to Groq API for code explanation")
            data = call_groq_api(messages, temperature=0.3, max_tokens=2000)
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "Unable to explain code execution.")
            return {"explanation": content}
        except Exception as fallback_err:
            logger.error(f"Fallback error in /explain: {fallback_err}")
            return {"explanation": f"Error explaining code execution: OpenRouter failed ({openrouter_err}), Fallback failed ({fallback_err})"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=False)