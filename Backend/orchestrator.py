# orchestrator.py — FULL VERSION with all agents
from models import PipelineRequest, PipelineResponse, AgentStatus
from agents.requirements_agent import run_requirements_agent
from agents.code_agent import run_code_agent
from agents.test_agent import run_test_agent
from agents.debug_agent import run_debug_agent
from agents.test_runner import run_tests
from config import settings

def run_pipeline(request: PipelineRequest) -> PipelineResponse:
    agent_results = []
    total_tokens = 0

    # ----- STEP 1: Requirements -----
    print('[Orchestrator] Step 1: Requirements Analysis')
    req_result = run_requirements_agent(request.prompt, request.language)
    agent_results.append(req_result)
    total_tokens += req_result.tokens_used
    
    if req_result.status == AgentStatus.FAILED:
        return PipelineResponse(
            success=False, 
            agent_results=agent_results,
            total_tokens=total_tokens, 
            error=req_result.error
        )

    # ----- STEP 2: Code Writing -----
    print('[Orchestrator] Step 2: Writing Code')
    code_result = run_code_agent(req_result.output, request.language)
    agent_results.append(code_result)
    total_tokens += code_result.tokens_used
    
    if code_result.status == AgentStatus.FAILED:
        return PipelineResponse(
            success=False, 
            requirement_spec=req_result.output,
            agent_results=agent_results, 
            total_tokens=total_tokens,
            error=code_result.error
        )
    
    current_code = code_result.output

    # ----- STEP 3: Test Writing -----
    print('[Orchestrator] Step 3: Writing Tests')
    test_result = run_test_agent(current_code, req_result.output)
    agent_results.append(test_result)
    total_tokens += test_result.tokens_used
    
    if test_result.status == AgentStatus.FAILED:
        return PipelineResponse(
            success=False, 
            requirement_spec=req_result.output,
            generated_code=current_code, 
            agent_results=agent_results,
            total_tokens=total_tokens, 
            error=test_result.error
        )

    # ----- STEP 4: Run Tests + Debug Loop -----
    debug_loops = 0
    MAX_LOOPS = settings.MAX_DEBUG_LOOPS
    
    while debug_loops <= MAX_LOOPS:
        print(f'[Orchestrator] Running tests (attempt {debug_loops + 1})')
        run_result = run_tests(current_code, test_result.output)
        
        if run_result.passed:
            print(f'[Orchestrator] All tests PASSED after {debug_loops} debug loops')
            break
            
        if debug_loops >= MAX_LOOPS:
            print(f'[Orchestrator] Max debug loops reached. Returning best attempt.')
            break
            
        # Tests failed — call Debugger
        print(f'[Orchestrator] Tests failed. Calling Debugger (loop {debug_loops + 1})')
        debug_result = run_debug_agent(current_code, run_result.output)
        agent_results.append(debug_result)
        total_tokens += debug_result.tokens_used
        
        current_code = debug_result.output
        debug_loops += 1

    return PipelineResponse(
        success=True,
        requirement_spec=req_result.output,
        generated_code=current_code,
        test_code=test_result.output,
        debug_loops=debug_loops,
        agent_results=agent_results,
        total_tokens=total_tokens
    )