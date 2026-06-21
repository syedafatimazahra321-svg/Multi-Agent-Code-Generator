// App.jsx — Full production version (Python Only Optimization)
import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import AgentTimeline from './components/AgentTimeline';
import CodeDisplay from './components/CodeDisplay';

const API = 'http://localhost:8000';

const EXAMPLES = [
  'Build a calculator with divide-by-zero handling',
  'Write a password strength checker function',
  'Implement a stack that returns min() in O(1)',
  'Create a function that flattens a nested list',
];

const statColorMap = {
  violet: 'text-violet-400',
  amber: 'text-amber-400',
  cyan: 'text-cyan-400',
  emerald: 'text-emerald-400',
  red: 'text-rose-400'
};

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  async function handleRun() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setElapsed(0);
    
    const t0 = Date.now();
    const timer = setInterval(() => setElapsed(Date.now() - t0), 100);
    
    try {
      const res = await axios.post(`${API}/api/run`, { 
        prompt, 
        language: 'python' 
      });
      setResult(res.data);
    } catch (e) {
      setError(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
      clearInterval(timer);
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] font-sans antialiased text-slate-300 selection:bg-violet-500/20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        
        {/* Input Control Center */}
        <div className="bg-[#161616] rounded-xl border border-[#2D2D3A] p-6 shadow-sm">

          <textarea 
            value={prompt} 
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => (e.metaKey || e.ctrlKey) && e.key === 'Enter' && handleRun()}
            className="w-full h-28 bg-[#0D0D0D] border border-[#2D2D3A] rounded-lg p-4 text-slate-100 resize-none focus:outline-none focus:border-violet-500 transition-colors text-sm placeholder-slate-600 font-mono"
            placeholder="Describe what you want to build... (Ctrl+Enter to fire production run)"
          />
          
          {/* Action Row & Prompt Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-600 mr-1">
                Presets:
              </span>
              {EXAMPLES.map((ex, i) => (
                <button 
                  key={i} 
                  onClick={() => setPrompt(ex)}
                  className="text-xs text-slate-400 hover:text-violet-400 hover:border-violet-500/40 bg-[#1E1E2E] border border-[#2D2D3A] px-2.5 py-1 rounded-md transition-all truncate max-w-[220px]"
                  title={ex}
                >
                  {ex}
                </button>
              ))}
            </div>
            
            <button 
              onClick={handleRun} 
              disabled={loading || !prompt.trim()}
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-semibold text-sm text-white shadow-sm shadow-violet-900/20 transition-all flex items-center justify-center gap-2.5 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Compiling Pipeline... {(elapsed / 1000).toFixed(1)}s
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Run Agent Suite
                </>
              )}
            </button>
          </div>

        </div>

        {/* Dynamic Agent Orchestrator Grid Map */}
        <AgentTimeline
          agentResults={result?.agent_results}
          loading={loading}
        />

        {/* System Error Banner */}
        {error && (
          <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-start gap-3 shadow-inner">
            <svg className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="font-mono text-xs whitespace-pre-wrap">{error}</div>
          </div>
        )}

        {/* Results Panel */}
        {result && (
          <div className="space-y-6">
            
            {/* System Performance KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                ['Tokens Used', result.total_tokens?.toLocaleString(), 'violet'],
                ['Debug Loops', result.debug_loops, 'amber'],
                ['Agents Run', result.agent_results?.length, 'cyan'],
                ['Status', result.success ? 'Success' : 'Failed', result.success ? 'emerald' : 'red'],
              ].map(([label, val, color]) => (
                <div key={label} className="bg-[#161616] border border-[#2D2D3A] rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
                  <div className={`text-xl font-bold tracking-tight ${statColorMap[color] || 'text-slate-200'}`}>
                    {val}
                  </div>
                  <div className="text-slate-500 text-[11px] font-medium uppercase tracking-wider mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Generated Code Specifications Output Viewports */}
            <div className="space-y-4">
              <CodeDisplay 
                title="Requirement Spec (JSON Output)" 
                code={result.requirement_spec} 
                language="json" 
                color="cyan" 
                autoFocus={false}
              />
              <CodeDisplay 
                title="Generated Target Code" 
                code={result.generated_code} 
                language="python" 
                color="violet" 
                autoFocus={false}
              />
              <CodeDisplay 
                title="Automated Validation Test Suite" 
                code={result.test_code} 
                language="python" 
                color="amber" 
                autoFocus={false}
              />
            </div>

          </div>
        )}
      </main>
    </div>
  );
}