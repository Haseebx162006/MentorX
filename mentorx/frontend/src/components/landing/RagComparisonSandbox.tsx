"use client";

import React, { useState } from "react";
import { XCircle, CheckCircle2, BookOpen, AlertTriangle, Sparkles, ArrowRight } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

export default function RagComparisonSandbox() {
  const { setCurrentView } = useUIStore();
  const [selectedExample, setSelectedExample] = useState(0);

  const examples = [
    {
      query: "How do you calculate the efficiency of a Carnot Engine for FSc Physics Part 2?",
      generic: {
        title: "Generic AI Chatbot (Ungrounded)",
        content:
          "Carnot efficiency can be calculated using various engineering formulas depending on heat capacity ratios (Cp/Cv) and imperial units (Rankine temperature scale) used in American college thermodynamics.",
        flaws: [
          "Uses foreign out-of-syllabus imperial units (Rankine)",
          "Does not cite Punjab/Federal Board Chapter 11",
          "Includes irrelevant mechanical engineering equations",
        ],
      },
      mentorx: {
        title: "MentorX Curriculum-Grounded RAG",
        content:
          "In FSc Physics Book II (Chapter 11: Thermodynamics), Carnot efficiency is defined as the maximum theoretical efficiency operating between hot reservoir (T₁) and cold reservoir (T₂):\n\nη = 1 - (T₂ / T₁) = (Q₁ - Q₂) / Q₁ × 100%\n\nKey Board Rule: Temperatures MUST be converted to absolute Kelvin (T = °C + 273).",
        strengths: [
          "Direct reference to FSc Physics Book II Chapter 11",
          "Includes exact board exam numerical rules (Kelvin conversion)",
          "100% textbook verified with zero out-of-syllabus noise",
        ],
        source: "Physics Book II, Page 246 • UHS MDCAT Syllabus",
      },
    },
    {
      query: "What is the key mechanism difference between Aldol Condensation and Cannizzaro Reaction?",
      generic: {
        title: "Generic AI Chatbot (Ungrounded)",
        content:
          "Both are carbonyl reactions that occur in organic chemistry under acidic or basic conditions with various catalyst complexes.",
        flaws: [
          "Misses the crucial board distinction: presence of α-hydrogen",
          "Fails to specify concentration of alkali required (10% vs 50% NaOH)",
        ],
      },
      mentorx: {
        title: "MentorX Curriculum-Grounded RAG",
        content:
          "According to FSc Chemistry Book II (Chapter 12: Aldehydes & Ketones):\n\n1. Aldol Condensation requires aldehydes/ketones possessing at least ONE α-hydrogen in the presence of dilute base (10% NaOH) to form β-hydroxy aldehydes.\n2. Cannizzaro Reaction occurs in aldehydes having NO α-hydrogen (e.g. Formaldehyde, Benzaldehyde) in concentrated base (50% NaOH) via self-oxidation-reduction.",
        strengths: [
          "Precise chemical condition differentiation (10% vs 50% NaOH)",
          "Clear α-hydrogen criteria tested in MDCAT MCQs",
          "Structured tabular recall format",
        ],
        source: "Chemistry Book II, Ch 12 • FSc Punjab Curriculum",
      },
    },
  ];

  const ex = examples[selectedExample];

  return (
    <section className="py-16 px-6 sm:px-12 bg-[#fafafa] border-t border-[#f4f4f5]">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-10 max-w-xl">
          <div className="text-[11px] font-mono font-bold text-[#71717a] uppercase tracking-wider mb-2">
            WHY ACCURACY MATTERS
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#18181b]">
            Generic AI vs. MentorX Board Grounding
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#71717a]">
            See why standard chatbots lead students to exam deductions, and how MentorX ensures curriculum precision.
          </p>
        </div>

        {/* Query Switcher Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {examples.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedExample(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedExample === idx
                  ? "bg-[#18181b] text-white shadow-xs"
                  : "bg-white border border-[#e4e4e7] text-[#71717a] hover:text-[#18181b]"
              }`}
            >
              Example {idx + 1}: {item.query.substring(0, 36)}...
            </button>
          ))}
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generic AI Box */}
          <div className="p-6 rounded-3xl bg-white border border-[#fee2e2] shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#fee2e2]">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-[#dc2626]" />
                  <span className="text-xs font-bold text-[#991b1b]">{ex.generic.title}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#991b1b] font-semibold">
                  Unverified
                </span>
              </div>
              <p className="text-xs text-[#52525b] leading-relaxed mb-6 whitespace-pre-line font-normal">
                {ex.generic.content}
              </p>
            </div>

            <div className="space-y-1.5 pt-4 border-t border-[#f4f4f5]">
              <div className="text-[10px] font-mono font-bold text-[#dc2626] uppercase mb-1">
                Common Exam Pitfalls:
              </div>
              {ex.generic.flaws.map((flaw, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#71717a]">
                  <span className="text-[#dc2626] font-bold">✕</span>
                  <span>{flaw}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MentorX Box */}
          <div className="p-6 rounded-3xl bg-white border-2 border-[#18181b] shadow-md flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#f4f4f5]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803d]" />
                  <span className="text-xs font-bold text-[#18181b]">{ex.mentorx.title}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] font-bold">
                  100% Board Aligned
                </span>
              </div>
              <div className="text-xs text-[#18181b] leading-relaxed mb-6 whitespace-pre-line font-medium bg-[#fafafa] p-3.5 rounded-xl border border-[#e4e4e7]">
                {ex.mentorx.content}
              </div>
            </div>

            <div>
              <div className="space-y-1.5 pt-4 border-t border-[#f4f4f5] mb-4">
                <div className="text-[10px] font-mono font-bold text-[#15803d] uppercase mb-1">
                  Why MentorX Excels:
                </div>
                {ex.mentorx.strengths.map((str, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#27272a]">
                    <span className="text-[#15803d] font-bold">✓</span>
                    <span>{str}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#f4f4f5] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#71717a] truncate max-w-[280px]">
                  📖 {ex.mentorx.source}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentView("workspace")}
                  className="px-3.5 py-1.5 rounded-full bg-[#18181b] text-white text-[11px] font-semibold hover:bg-[#27272a] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Try Query</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
