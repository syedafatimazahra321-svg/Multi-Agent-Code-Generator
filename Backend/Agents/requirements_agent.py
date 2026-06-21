# requirements_agent.py
# This agent takes messy user text and returns a clean JSON spec
import anthropic
import json
from config import settings
from models import AgentResult, AgentStatus

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

REQUIREMENTS_PROMPT = '''
You are a senior software architect. Your job is to analyze a user's request
and produce a STRICT JSON specification. Nothing else — only valid JSON.

The JSON must have this exact structure:
{{
  "project_name": "short_snake_case_name",
  "description": "one sentence what this does",
  "language": "python",
  "functions": [
    {{
      "name": "function_name",
      "description": "what it does",
      "parameters": [
        {{"name": "x", "type": "int", "description": "..."}}
      ],
      "returns": {{"type": "int", "description": "..."}},
      "edge_cases": ["division by zero", "empty input"]
    }}
  ],
  "dependencies": [],
  "test_scenarios": ["scenario 1", "scenario 2"]
}}

User request: {user_request}

Respond with ONLY the JSON. No explanation. No markdown. No backticks.
'''

def run_requirements_agent(user_request: str, language: str = 'python') -> AgentResult:
    """
    Takes user's request string, returns structured spec as JSON string.
    """
    try:
        message = client.messages.create(
            model=settings.MODEL,
            max_tokens=settings.MAX_TOKENS,
            messages=[{
                'role': 'user',
                'content': REQUIREMENTS_PROMPT.format(user_request=user_request)
            }]
        )
        
        raw_output = message.content[0].text.strip()
        
        # Validate it is actually valid JSON
        parsed = json.loads(raw_output)
        
        return AgentResult(
            agent_name='RequirementsAnalyst',
            status=AgentStatus.SUCCESS,
            output=json.dumps(parsed, indent=2),
            tokens_used=message.usage.input_tokens + message.usage.output_tokens
        )
        
    except json.JSONDecodeError as e:
        return AgentResult(
            agent_name='RequirementsAnalyst',
            status=AgentStatus.FAILED,
            output='',
            error=f'Agent returned invalid JSON: {str(e)}'
        )
    except Exception as e:
        return AgentResult(
            agent_name='RequirementsAnalyst',
            status=AgentStatus.FAILED,
            output='',
            error=str(e)
        )