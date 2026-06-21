# Multi-Agent Code Generator

A multi-agent AI system that turns plain English requirements into tested, working code. Four agents: Requirements Analyst, Code Writer, Test Writer, and Debugger, collaborate under a central Orchestrator with a self-correcting debug loop that automatically fixes failing code.

it is Built using raw Claude API calls rather than agentic frameworks.

---

## Workflow

```
User Prompt
   → Orchestrator
   → Requirements Analyst (creates spec)
   → Code Writer (writes code)
   → Test Writer (writes tests)
   → Test Runner (runs tests)
   → if tests fail: Debugger fixes code, loops back (max 3x)
   → Done
```

---

## Tech Stack

   → Python 3.11
   → FastAPI
   → Anthropic Claude API
   → pytest
   → React 18 + Vite
   → Tailwind CSS
   → Axios
   → Tailwind CSS 
   → Axios 
