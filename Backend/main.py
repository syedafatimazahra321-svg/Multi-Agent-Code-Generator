# main.py
# Entry point for the FastAPI server
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import PipelineRequest, PipelineResponse
from orchestrator import run_pipeline
from config import settings

# Validate API key on startup
settings.validate()

app = FastAPI(
    title='Multi-Agent AI System',
    description='Agentic pipeline: Requirements -> Code -> Tests -> Debug',
    version='1.0.0'
)

# Allow React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get('/')
def health_check():
    return {
        'status': 'healthy',
        'model': settings.MODEL,
        'version': '1.0.0'
    }

@app.post('/api/run', response_model=PipelineResponse)
def run_agent_pipeline(request: PipelineRequest):
    """Main endpoint — receives user prompt, returns pipeline results"""
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail='Prompt cannot be empty')
    try:
        result = run_pipeline(request)
        return result
    except Exception as e:
        import traceback
        print("\n=== CRITICAL PIPELINE CRASH TRACEBACK ===")
        traceback.print_exc()
        print("==========================================\n")
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/api/health')
def detailed_health():
    """Detailed health check — shows all settings"""
    return {
        'api_key_set': bool(settings.ANTHROPIC_API_KEY),
        'model': settings.MODEL,
        'max_tokens': settings.MAX_TOKENS,
        'max_debug_loops': settings.MAX_DEBUG_LOOPS
    }