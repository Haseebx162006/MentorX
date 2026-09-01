"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";

const HIGHLIGHT_SETS = [
  {
    main: ["ACADEMIC COUNSELOR", "ADMISSION AGENTS"],
    faded: ["CLOSING MERIT MATRIX", "AGGREGATE INGESTION"],
  },
  {
    main: ["CLOSING MERIT MATRIX", "AGGREGATE INGESTION"],
    faded: ["PROSPECTUS RAG SEARCH", "SCHOLARSHIP TRACKING"],
  },
  {
    main: ["PROSPECTUS RAG SEARCH", "SCHOLARSHIP TRACKING"],
    faded: ["AUTONOMOUS ADMISSIONS", "PERSONALIZED ROADMAPS"],
  },
  {
    main: ["AUTONOMOUS ADMISSIONS", "PERSONALIZED ROADMAPS"],
    faded: ["ACADEMIC COUNSELOR", "ADMISSION AGENTS"],
  },
];

export default function WelcomeLoader() {
  const { finishLoader } = useUIStore();
  const [progress, setProgress] = useState(0);
  const [activeSetIndex, setActiveSetIndex] = useState(0);

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

        const next = prev + 2;
        if (next === 26) setActiveSetIndex(1);
        if (next === 54) setActiveSetIndex(2);
        if (next === 80) setActiveSetIndex(3);

        return next;
      });
    }, 28);

    return () => clearInterval(timer);
  }, [finishLoader]);

  const currentSet = HIGHLIGHT_SETS[activeSetIndex];

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#eaedf2] flex flex-col justify-between p-6 sm:p-10 select-none z-50 overflow-hidden text-[#0f172a]">
      {/* ================= Top Bar ================= */}
      <div className="w-full flex items-start justify-between">
        {/* Left: Target Radar & Progress Counter */}
        <div className="flex items-center gap-3.5">
          {/* Pulsing Sonar Ring */}
          <div className="relative w-8 h-8 rounded-full border border-[#64748b]/50 flex items-center justify-center">
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
          className="px-5 py-1.5 rounded-full border border-[#94a3b8] text-xs font-mono font-semibold tracking-widest text-[#334155] hover:bg-[#0f172a] hover:text-white hover:border-[#0f172a] transition-all cursor-pointer"
        >
          SKIP INTRO
        </button>
      </div>

      {/* ================= Center: Giant Stacked Brutalist Typography ================= */}
      <div className="w-full max-w-6xl my-auto py-4">
        <motion.div
          key={activeSetIndex}
          initial={{ opacity: 0.8, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col space-y-1 sm:space-y-2"
        >
          {/* Active Highlight Lines (Dark High Contrast) */}
          {currentSet.main.map((line, idx) => (
            <h1
              key={`main-${idx}`}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black uppercase tracking-tight text-[#0f172a] leading-[0.92] transition-colors"
            >
              {line}
            </h1>
          ))}

          {/* Faded Secondary Lines (Muted Theme Accent) */}
          {currentSet.faded.map((line, idx) => (
            <h2
              key={`faded-${idx}`}
              className={`text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black uppercase tracking-tight leading-[0.92] transition-colors ${
                idx === 0 ? "text-[#94a3b8]" : "text-[#cbd5e1]"
              }`}
            >
              {line}
            </h2>
          ))}
        </motion.div>
      </div>

      {/* ================= Bottom Bar: System & Stack Metadata ================= */}
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
