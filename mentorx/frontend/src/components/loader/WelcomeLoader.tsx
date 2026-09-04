"use client";

import React, { useEffect, useState, useRef } from "react";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Sparkles } from "lucide-react";

interface LoaderLine {
  id: string;
  title: string;
  words: string[];
  tag: string;
  desc: string;
}

const LINES: LoaderLine[] = [
  {
    id: "agents",
    title: "MENTORX AGENTS",
    words: ["MENTORX", "AGENTS"],
    tag: "01 // REASONING",
    desc: "Autonomous Academic Mentorship & Short-Term Memory",
  },
  {
    id: "ingestion",
    title: "MERIT INGESTION",
    words: ["MERIT", "INGESTION"],
    tag: "02 // AGGREGATE",
    desc: "Closing Cutoffs, Formulas & Entry Test Weightages",
  },
  {
    id: "rag",
    title: "PROSPECTUS RAG",
    words: ["PROSPECTUS", "RAG"],
    tag: "03 // RETRIEVAL",
    desc: "Qdrant Vector Knowledge Base & Prospectus Chunks",
  },
  {
    id: "matrix",
    title: "CAREER MATRIX",
    words: ["CAREER", "MATRIX"],
    tag: "04 // PROGRAM FIT",
    desc: "FSc Pre-Med, Pre-Eng & ICS Stream Compatibility",
  },
];

export default function WelcomeLoader() {
  const { finishLoader, setCurrentView } = useUIStore();
  const { isAuthenticated, user } = useAuthStore();

  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFinish = () => {
    finishLoader();
    if (isAuthenticated) {
      setCurrentView(user?.role === "admin" ? "admin" : "workspace");
    } else {
      setCurrentView("landing");
    }
  };

  // Progress counter from 0% to 100% over ~3.2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            handleFinish();
          }, 350);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [isAuthenticated, user]);

  // Track mouse coordinates for the dynamic hover spotlight effect around words
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Determine which line is actively highlighted in sequence
  // 0-24%: Line 0
  // 25-49%: Line 1
  // 50-74%: Line 2
  // 75-89%: Line 3
  // 90-100%: All Lines illuminated in unison
  const activeSequenceIndex =
    progress >= 90 ? 4 : Math.min(Math.floor(progress / 25), 3);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 w-screen h-screen bg-[#eaedf2] flex flex-col justify-between p-6 sm:p-12 select-none z-50 overflow-hidden text-[#0f172a] relative"
    >
      {/* Dynamic Cursor Spotlight Hovering Around Words */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(15, 23, 42, 0.08), transparent 80%)`,
        }}
      />

      {/* ================= Top Navigation Bar ================= */}
      <div className="w-full flex items-start justify-between relative z-10">
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
          onClick={handleFinish}
          className="px-5 py-1.5 rounded-full border border-[#94a3b8] text-xs font-mono font-medium tracking-widest text-[#334155] hover:bg-[#0f172a] hover:text-white hover:border-[#0f172a] transition-all cursor-pointer shadow-xs active:scale-95"
        >
          SKIP INTRO
        </button>
      </div>

      {/* ================= Center: Animated 4 Typography Lines ================= */}
      <div className="w-full max-w-6xl my-auto py-2 relative z-10">
        <div className="flex flex-col space-y-2 sm:space-y-3">
          {LINES.map((line, idx) => {
            // Determine highlight state: either manual hover or sequential progress
            const isHighlighted =
              hoveredIndex !== null
                ? hoveredIndex === idx
                : activeSequenceIndex === 4 || activeSequenceIndex === idx;

            const isPassed = activeSequenceIndex === 4 || idx < activeSequenceIndex;

            return (
              <div
                key={line.id}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative transition-all duration-500 rounded-2xl p-2 -ml-2 cursor-pointer ${
                  isHighlighted
                    ? "bg-white/60 shadow-xs border-l-4 border-[#0f172a] pl-4 sm:pl-6 translate-x-2"
                    : isPassed
                    ? "border-l-4 border-[#64748b]/20 pl-4 sm:pl-6"
                    : "border-l-4 border-transparent pl-4 sm:pl-6"
                }`}
              >
                {/* Active Line Metadata Pill */}
                <div
                  className={`flex items-center gap-2 mb-1 text-[10px] sm:text-xs font-mono transition-all duration-300 ${
                    isHighlighted
                      ? "text-[#0f172a] opacity-100 font-bold"
                      : "text-[#94a3b8] opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <span className="inline-flex items-center gap-1 bg-[#0f172a] text-white px-2 py-0.5 rounded text-[9px]">
                    <Sparkles className="w-2.5 h-2.5" />
                    {line.tag}
                  </span>
                  <span className="hidden sm:inline font-medium text-[#475569]">{line.desc}</span>
                </div>

                {/* Big Brutalist Heading with Word Hover Splitting */}
                <h1
                  className={`text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black uppercase tracking-tight leading-[0.92] transition-all duration-500 flex flex-wrap gap-x-4 ${
                    isHighlighted
                      ? "text-[#0f172a] scale-[1.01]"
                      : isPassed
                      ? "text-[#334155]/75 hover:text-[#0f172a]"
                      : "text-[#94a3b8]/35 hover:text-[#0f172a]"
                  }`}
                >
                  {line.words.map((word, wIdx) => (
                    <span
                      key={wIdx}
                      className="inline-block transition-transform duration-200 hover:scale-105 hover:-translate-y-0.5"
                    >
                      {word}
                    </span>
                  ))}
                </h1>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= Bottom Bar: Architecture Metadata ================= */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#cbd5e1]/60 pt-4 text-[10px] sm:text-[11px] font-mono text-[#64748b] tracking-wider uppercase relative z-10">
        <div>(C) MENTORX AI ACADEMIC SYSTEM</div>
        <div className="flex items-center gap-2">
          <span className="hover:text-[#0f172a] transition-colors">LANGGRAPH</span>
          <span>+</span>
          <span className="hover:text-[#0f172a] transition-colors">NEON POSTGRES</span>
          <span>+</span>
          <span className="hover:text-[#0f172a] transition-colors">GROQ LPU</span>
          <span>+</span>
          <span className="hover:text-[#0f172a] transition-colors">QDRANT</span>
        </div>
      </div>
    </div>
  );
}
