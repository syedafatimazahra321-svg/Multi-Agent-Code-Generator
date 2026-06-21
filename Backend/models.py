# models.py
# These are data shapes — like forms with specific fields
from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class AgentStatus(str, Enum):
    PENDING = 'pending'
    RUNNING = 'running'
    SUCCESS = 'success'
    FAILED = 'failed'

class AgentResult(BaseModel):
    agent_name: str
    status: AgentStatus
    output: str
    error: Optional[str] = None
    tokens_used: int = 0

class PipelineRequest(BaseModel):
    prompt: str             # What the user typed
    language: str = 'python' # Which coding language to use

class PipelineResponse(BaseModel):
    success: bool
    requirement_spec: Optional[str] = None
    generated_code: Optional[str] = None
    test_code: Optional[str] = None
    debug_loops: int = 0
    agent_results: List[AgentResult] = []
    total_tokens: int = 0
    error: Optional[str] = None