// CodeDisplay.jsx — shows code with copy button
import React, { useState } from 'react';

const colorMap = {
  violet: {
    accent: 'border-l-violet-500',
    text: 'text-violet-400',
    bg: 'bg-violet-500/5'
  },
  cyan: {
    accent: 'border-l-cyan-500',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/5'
  },
  amber: {
    accent: 'border-l-amber-500',
    text: 'text-amber-400',
    bg: 'bg-amber-500/5'
  },
};

export default function CodeDisplay({ title, code, language = 'python', color = 'violet' }) {
  const [copied, setCopied] = useState(false);

  if (!code) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTheme = colorMap[color] || colorMap.violet;

  return (
    <div className={`w-full bg-[#161616] border border-[#2D2D3A] border-l-4 ${currentTheme.accent} rounded-xl overflow-hidden shadow-sm flex flex-col`}>
      {/* Top Header Bar */}
      <div className="w-full border-b border-[#2D2D3A]/60 px-5 py-3 flex items-center justify-between bg-[#1E1E2E]/40">
        <div className="flex items-center gap-2.5">
          <span className={`text-xs font-semibold uppercase tracking-wider ${currentTheme.text}`}>
            {title}
          </span>
          <span className="text-[10px] bg-[#1E1E2E] border border-[#2D2D3A] text-slate-500 px-2 py-0.5 rounded-md font-mono">
            {language}
          </span>
        </div>
        
        <button
          onClick={handleCopy}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 flex items-center gap-1.5 ${
            copied
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-[#1E1E2E] border-[#2D2D3A] text-slate-400 hover:text-slate-200 hover:bg-[#252535]'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Code
            </>
          )}
        </button>
      </div>

      {/* Code Text Window */}
      <div className="p-5 overflow-x-auto bg-[#13131F]/30 font-mono text-sm leading-relaxed text-slate-300 selection:bg-violet-500/20">
        <pre className="whitespace-pre scrollbar-thin scrollbar-thumb-[#2D2D3A]">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}