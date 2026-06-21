// Header.jsx
import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-[#1E1E2E] border-b border-[#2D2D3A] px-6 py-4 flex items-center justify-between">
      {/* Left Section: Branding */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-semibold text-white">
          AI
        </div>
        <div>
          <h1 className="text-base font-semibold text-slate-100 tracking-tight">
            MultiAgent Studio
          </h1>
          <p className="text-xs text-slate-400">
            Powered by Claude Sonnet
          </p>
        </div>
      </div>

      {/* Right Section: Status Indicator */}
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span className="hidden sm:inline border-r border-[#2D2D3A] pr-4 text-slate-500 font-mono">
          v1.0.0
        </span>
        <div className="flex items-center gap-2 bg-[#161616] px-3 py-1.5 rounded-full border border-[#2D2D3A]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-medium tracking-wide uppercase text-slate-300">
            System Live
          </span>
        </div>
      </div>
    </header>
  );
}