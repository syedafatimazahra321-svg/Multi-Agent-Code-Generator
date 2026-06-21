# test_agent.py
# Reads the generated code and writes pytest test cases
import anthropic
from config import settings
from models import AgentResult, AgentStatus

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

TEST_PROMPT = '''
You are a QA engineer specializing in Python testing. Write comprehensive pytest
tests for the following code. Rules:

1. Write ONLY pytest test code — no markdown, no backticks, no explanations
2. Import the functions using: from solution import *
3. Write at least 5 test functions
4. Cover: happy path, edge cases, error cases, boundary values
5. Each test function name must start with test_
6. Use assert statements with descriptive messages
7. Group related tests together

Code to test:
{code}

Spec for reference (for edge cases):
{spec}

Write complete pytest test code now. Only test code, nothing else.
'''

def run_test_agent(code: str, spec_json: str) -> AgentResult:
    """
    Takes generated code + original spec.
    Returns complete pytest test file.
    """
    try:
        message = client.messages.create(
            model=settings.MODEL,
            max_tokens=settings.MAX_TOKENS,
            messages=[{
                'role': 'user',
                'content': TEST_PROMPT.format(code=code, spec=spec_json)
            }]
        )
        
        tests = message.content[0].text.strip()
        
        if tests.startswith('```'):
            lines = tests.split('\n')
            tests = '\n'.join(lines[1:-1])
            
        return AgentResult(
            agent_name='TestWriter',
            status=AgentStatus.SUCCESS,
            output=tests,
            tokens_used=message.usage.input_tokens + message.usage.output_tokens
        )
    except Exception as e:
        return AgentResult(
            agent_name='TestWriter',
            status=AgentStatus.FAILED,
            output='',
            error=str(e)
        )