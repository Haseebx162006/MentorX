"use client";

import React from "react";
import {
  BookOpen,
  GitMerge,
  Search,
  Cpu,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

export default function FeaturesGrid() {
  const features = [
    {
      icon: <BookOpen className="w-5 h-5 text-[#18181b]" />,
      title: "Board Textbook Grounding",
      desc: "Every response is grounded against official provincial board textbooks (Punjab, Federal, Sindh, KPK) using Qdrant vector retrieval.",
      badge: "Zero Hallucination",
    },
    {
      icon: <GitMerge className="w-5 h-5 text-[#18181b]" />,
      title: "Self-Refining LangGraph Pipeline",
      desc: "Evaluates retrieved chunks, sentence-decomposes context with precision filters, and eliminates irrelevant fluff.",
      badge: "LangGraph Core",
    },
    {
      icon: <Search className="w-5 h-5 text-[#18181b]" />,
      title: "Hybrid Web & Local Fallback",
      desc: "For novel or mixed queries, MentorX merges verified textbook chunks with fresh web results via Tavily search.",
      badge: "Adaptive RAG",
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-[#18181b]" />,
      title: "Entry Test Target Modes",
      desc: "Customized analytical explanations geared specifically for MDCAT, ECAT, NUST NET, and FAST admission examinations.",
      badge: "High Yield",
    },
    {
      icon: <Cpu className="w-5 h-5 text-[#18181b]" />,
      title: "Sub-Second Groq Inference",
      desc: "Powered by Llama 3.3 70B on ultra-fast Groq LPUs for instantaneous, low-latency explanations without waiting.",
      badge: "Ultra Fast",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#18181b]" />,
      title: "Transparent Source Citations",
      desc: "Clickable source pills displaying the exact chapter, page, and relevance score used to generate your explanation.",
      badge: "Auditable",
    },
  ];

  return (
    <section className="py-16 px-6 sm:px-12 bg-white border-t border-[#f4f4f5]">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-12 max-w-xl">
          <div className="text-[11px] font-mono font-bold text-[#71717a] uppercase tracking-wider mb-2">
            ARCHITECTURE & CAPABILITIES
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#18181b]">
            Precision intelligence engineered for curriculum success
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#71717a] leading-relaxed">
            Eliminating generic AI inaccuracies with multi-stage verification and verified textbook grounding.
          </p>
        </div>

        {/* Features 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] hover:border-[#a1a1aa] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#e4e4e7] flex items-center justify-center shadow-2xs">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white border border-[#e4e4e7] text-[#52525b]">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#18181b] mb-1.5">{f.title}</h3>
                <p className="text-xs text-[#71717a] leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
