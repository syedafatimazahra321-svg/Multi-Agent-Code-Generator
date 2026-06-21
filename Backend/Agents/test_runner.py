# test_runner.py
import subprocess
import tempfile
import os
import sys
from dataclasses import dataclass

@dataclass
class TestRunResult:
    passed: bool
    output: str
    error_output: str
    num_passed: int = 0
    num_failed: int = 0

def run_tests(code: str, test_code: str) -> TestRunResult:
    """Writes code and tests to temp files, runs pytest, returns results safely."""
    with tempfile.TemporaryDirectory() as tmpdir:
        code_path = os.path.join(tmpdir, 'solution.py')
        # FIXED: Added encoding='utf-8' to handle emojis/unicode characters on Windows
        with open(code_path, 'w', encoding='utf-8') as f:
            f.write(code)
            
        test_path = os.path.join(tmpdir, 'test_solution.py')
        # FIXED: Added encoding='utf-8' to handle emojis/unicode characters on Windows
        with open(test_path, 'w', encoding='utf-8') as f:
            f.write(test_code)
            
        try:
            result = subprocess.run(
                [sys.executable, '-m', 'pytest', test_path, '-v', '--tb=short'],
                capture_output=True,
                text=True,
                timeout=5, # Drop to 5 seconds so tests run much faster
                cwd=tmpdir
            )
            output = result.stdout
            passed = result.returncode == 0
            error_output = result.stderr
        except subprocess.TimeoutExpired:
            return TestRunResult(
                passed=False,
                output="ERROR: Test execution timed out. Do not use interactive input() functions.",
                error_output="TimeoutExpired",
                num_passed=0,
                num_failed=1
            )
        
        num_passed = output.count(' PASSED')
        num_failed = output.count(' FAILED') + output.count(' ERROR')
        
        return TestRunResult(
            passed=passed,
            output=output,
            error_output=error_output,
            num_passed=num_passed,
            num_failed=num_failed
        )