"use client";

import React, { useEffect, useState } from "react";
import { useUIStore } from "@/store/useUIStore";

export default function WelcomeLoader() {
  const { finishLoader } = useUIStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            finishLoader();
          }, 350);
          return 100;
        }
        return prev + 2;
      });
    }, 28);

    return () => clearInterval(timer);
  }, [finishLoader]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#eaedf2] flex flex-col justify-between p-6 sm:p-12 select-none z-50 overflow-hidden text-[#0f172a]">
      {/* ================= Top Navigation Bar ================= */}
      <div className="w-full flex items-start justify-between">
        {/* Left: Radar Indicator & Live Counter */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-8 h-8 rounded-full border border-[#64748b]/40 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#0f172a]" />
            <span className="absolute inset-0 rounded-full border border-[#0f172a] animate-ping opacity-30" />
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-[#0f172a] leading-none">
              {progress}%
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] font-semibold tracking-widest text-[#64748b] uppercase mt-1">
              MENTORX AUTONOMOUS ENGINE
            </span>
          </div>
        </div>

        {/* Right: SKIP INTRO Pill Button */}
        <button
          type="button"
          onClick={finishLoader}
          className="px-5 py-1.5 rounded-full border border-[#94a3b8] text-xs font-mono font-medium tracking-widest text-[#334155] hover:bg-[#0f172a] hover:text-white hover:border-[#0f172a] transition-all cursor-pointer"
        >
          SKIP INTRO
        </button>
      </div>

      {/* ================= Center: 4 Short Brutalist Typography Lines ================= */}
      <div className="w-full max-w-6xl my-auto py-2">
        <div className="flex flex-col space-y-1 sm:space-y-2">
          {/* Line 1: Dark Bold */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.75rem] font-black uppercase tracking-tight text-[#0f172a] leading-[0.92]">
            MENTORX AGENTS
          </h1>

          {/* Line 2: Dark Bold */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.75rem] font-black uppercase tracking-tight text-[#0f172a] leading-[0.92]">
            MERIT INGESTION
          </h1>

          {/* Line 3: Faded Accent */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.75rem] font-black uppercase tracking-tight text-[#94a3b8] leading-[0.92]">
            PROSPECTUS RAG
          </h2>

          {/* Line 4: Faint Accent */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.75rem] font-black uppercase tracking-tight text-[#cbd5e1] leading-[0.92]">
            CAREER MATRIX
          </h2>
        </div>
      </div>

      {/* ================= Bottom Bar: System & Architecture Metadata ================= */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#cbd5e1]/60 pt-4 text-[10px] sm:text-[11px] font-mono text-[#64748b] tracking-wider uppercase">
        <div>(C) MENTORX AI ACADEMIC SYSTEM</div>
        <div className="flex items-center gap-2">
          <span>LANGGRAPH</span>
          <span>+</span>
          <span>NEON POSTGRES</span>
          <span>+</span>
          <span>GROQ LPU</span>
          <span>+</span>
          <span>QDRANT</span>
        </div>
      </div>
    </div>
  );
}
