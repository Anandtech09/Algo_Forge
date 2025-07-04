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
    allow_origins=["https://algo-forge-ashy.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("VITE_GROQ_API_KEY")
OPENROUTER_API_KEY = os.getenv("VITE_OPENROUTER_API_KEY")

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
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama3-70b-8192",
                "messages": [
                    {
                        "role": "system",
                        "content": """You are a Python interpreter simulator. Execute the given Python code and return EXACTLY what would be printed to the console.

Rules:
1. If there are print statements, show their output ONLY
2. If there are errors, show the Python error message
3. If the code has no output, return ‎ 
4. Do not add explanations, comments, or code blocks
5. Do not use backticks or markdown formatting
6. Return only the raw console output as it would appear in Python
7. Do not include "Output:" or any prefixes"""
                    },
                    {
                        "role": "user",
                        "content": f"Execute this Python code and return only the console output:\n\n{request.code}"
                    }
                ],
                "temperature": 0.1,
                "max_tokens": 1000,
            }
        )
        response.raise_for_status()
        data = response.json()
        
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
            error="Unexpected error during code execution. Please check backend configuration."
        )

@app.post("/analyze")
async def analyze_code(request: CodeRequest):
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama3-70b-8192",
                "messages": [
                    {
                        "role": "system",
                        "content": """You are a DSA expert. Analyze the code and provide ONLY time and space complexity in a concise format. Format: "Time: O(n), Space: O(1)" with brief explanation. Do not use code blocks or backticks."""
                    },
                    {
                        "role": "user",
                        "content": f"Analyze time and space complexity:\n\n{request.code}"
                    }
                ],
                "temperature": 0.1,
                "max_tokens": 200,
            }
        )
        response.raise_for_status()
        data = response.json()
        return {"analysis": data["choices"][0]["message"]["content"] or "Unable to analyze complexity."}
    except requests.exceptions.HTTPError as http_err:
        logger.error(f"HTTP error in /analyze: {http_err}")
        return {"analysis": f"HTTP error analyzing complexity: {str(http_err)}"}
    except Exception as e:
        logger.error(f"Unexpected error in /analyze: {e}")
        return {"analysis": "Unexpected error analyzing complexity."}

@app.post("/explain")
async def explain_code(request: CodeRequest):
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://algo-forge-ashy.vercel.app",
                "X-Title": "DSA Code Playground"
            },
            json={
                "model": "meta-llama/llama-3.1-8b-instruct",
                "messages": [
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
                ],
                "temperature": 0.3,
                "max_tokens": 2000,
            }
        )
        response.raise_for_status()
        data = response.json()
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "Unable to explain code execution.")
        return {"explanation": content}
    except requests.exceptions.HTTPError as http_err:
        logger.error(f"HTTP error in /explain: {http_err}")
        # Fallback to Groq API if OpenRouter fails
        try:
            logger.info("Falling back to Groq API for code explanation")
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "llama3-70b-8192",
                    "messages": [
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
                    ],
                    "temperature": 0.3,
                    "max_tokens": 2000,
                }
            )
            response.raise_for_status()
            data = response.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "Unable to explain code execution.")
            return {"explanation": content}
        except Exception as fallback_err:
            logger.error(f"Fallback error in /explain: {fallback_err}")
            return {"explanation": f"Error explaining code execution: OpenRouter failed ({http_err}), Fallback failed ({fallback_err})"}
    except Exception as e:
        logger.error(f"Unexpected error in /explain: {e}")
        return {"explanation": f"Unexpected error explaining code execution: {str(e)}"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=False)