# debug_agent.py
# Gets failing test output + original code and fixes the bug
import anthropic
from config import settings
from models import AgentResult, AgentStatus

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

DEBUG_PROMPT = '''
You are an expert debugger. You have code that fails tests. Fix it.
Rules:
1. Return ONLY the fixed code — no markdown, no backticks, no explanations
2. Preserve all original function signatures (same names, same parameters)
3. Fix only what is broken — do not rewrite working parts
4. Add a comment # FIXED:  above each change

Original code:
{code}

Failing test output:
{test_output}

Return the complete fixed code now.
'''

def run_debug_agent(code: str, test_output: str) -> AgentResult:
    """
    Takes original broken code and pytest crash strings.
    Returns the updated, bug-fixed code blocks.
    """
    try:
        message = client.messages.create(
            model=settings.MODEL,
            max_tokens=settings.MAX_TOKENS,
            messages=[{
                'role': 'user',
                'content': DEBUG_PROMPT.format(
                    code=code, test_output=test_output
                )
            }]
        )
        
        fixed_code = message.content[0].text.strip()
        
        if fixed_code.startswith('```'):
            lines = fixed_code.split('\n')
            fixed_code = '\n'.join(lines[1:-1])
            
        return AgentResult(
            agent_name='Debugger',
            status=AgentStatus.SUCCESS,
            output=fixed_code,
            tokens_used=message.usage.input_tokens + message.usage.output_tokens
        )
    except Exception as e:
        return AgentResult(
            agent_name='Debugger',
            status=AgentStatus.FAILED,
            output=code, # Return original if debug fails
            error=str(e)
        )