// AgentTimeline.jsx — shows each agent's status visually
import React from 'react';

const AGENTS = [
  { key: 'RequirementsAnalyst', label: 'Requirements', color: 'violet' },
  { key: 'CodeWriter', label: 'Code Writer', color: 'cyan' },
  { key: 'TestWriter', label: 'Test Writer', color: 'amber' },
  { key: 'Debugger', label: 'Debugger', color: 'rose' },
];

const colorMap = {
  violet: { border: 'border-violet-500/30', text: 'text-violet-400', bg: 'bg-violet-500/10' },
  cyan: { border: 'border-cyan-500/30', text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  amber: { border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  rose: { border: 'border-rose-500/30', text: 'text-rose-400', bg: 'bg-rose-500/10' },
};

export default function AgentTimeline({ agentResults = [], loading }) {
  const getStatus = (agentName) => {
    if (!agentResults || agentResults.length === 0) return 'idle';
    const r = agentResults.find(a => a.agent_name === agentName);
    return r ? r.status : 'idle';
  };

  return (
    <div className="w-full bg-[#1E1E2E] border border-[#2D2D3A] rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-slate-200 tracking-tight">
          Agent Orchestration Pipeline
        </h3>
        {loading && (
          <span className="text-xs text-violet-400 font-medium animate-pulse flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-ping"></span>
            Processing sequence...
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
        {AGENTS.map((agent, i) => {
          const status = getStatus(agent.key);
          const theme = colorMap[agent.color];
          
          // Determine status visuals safely
          let statusText = 'Idle';
          let badgeStyle = 'bg-[#161616] border-[#2D2D3A] text-slate-500';
          
          if (status === 'success') {
            statusText = 'Completed';
            badgeStyle = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
          } else if (status === 'failed') {
            statusText = 'Failed';
            badgeStyle = 'bg-rose-500/10 border-rose-500/30 text-rose-400';
          } else if (status === 'running' || (loading && agentResults.length === i)) {
            statusText = 'Active';
            badgeStyle = 'bg-violet-500/20 border-violet-500 text-violet-400 animate-pulse';
          }

          return (
            <div 
              key={agent.key} 
              className={`relative flex flex-col p-4 rounded-xl border ${
                statusText === 'Active' ? 'border-violet-500/50 bg-[#161616]' : 'border-[#2D2D3A] bg-[#161616]/40'
              } transition-all duration-200`}
            >
              {/* Top Row: Index and Status Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-slate-600 font-bold">
                  0{i + 1}
                </span>
                <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeStyle}`}>
                  {statusText}
                </span>
              </div>

              {/* Label */}
              <div className={`text-sm font-medium ${theme.text}`}>
                {agent.label}
              </div>
              
              {/* Dynamic context details */}
              <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {status === 'success' && 'Execution safe'}
                {status === 'failed' && 'Error isolated'}
                {statusText === 'Active' && 'Processing data...'}
                {status === 'idle' && statusText !== 'Active' && 'Awaiting step'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}