# code_agent.py
# Takes the JSON spec and writes actual working code

import anthropic
from config import settings
from models import AgentResult, AgentStatus

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

CODE_PROMPT = '''
You are a senior software engineer. Write clean, production-quality {language} code
based on this specification. Follow these rules exactly:

1. Write ONLY the code — no markdown, no backticks, no explanations
2. Include docstrings for every function
3. Include type hints for every parameter and return value
4. Handle all edge cases listed in the spec
5. Use descriptive variable names
6. Add inline comments for complex logic
7. Provide ONLY raw function/class definitions. NEVER add demonstration blocks, example calls, interactive function blocks like input(), or print statements at the bottom of the file.

Specification:
{spec}

Write the complete {language} code now. Only code, nothing else.
'''


def run_code_agent(spec_json: str, language: str = 'python') -> AgentResult:
    """
    Takes requirement spec JSON string.
    Returns complete working code.
    """
    try:
        message = client.messages.create(
            model=settings.MODEL,
            max_tokens=settings.MAX_TOKENS,
            messages=[{
                'role': 'user',
                'content': CODE_PROMPT.format(
                    language=language,
                    spec=spec_json
                )
            }]
        )

        code = message.content[0].text.strip()

        # Strip markdown if agent added it anyway
        if code.startswith('```'):
            lines = code.split('\n')
            code = '\n'.join(lines[1:-1])

        return AgentResult(
            agent_name='CodeWriter',
            status=AgentStatus.SUCCESS,
            output=code,
            tokens_used=message.usage.input_tokens + message.usage.output_tokens
        )

    except Exception as e:
        return AgentResult(
            agent_name='CodeWriter',
            status=AgentStatus.FAILED,
            output='',
            error=str(e)
        )