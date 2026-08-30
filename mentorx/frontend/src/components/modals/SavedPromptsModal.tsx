"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, BrainCircuit, Atom, CheckCheck, Compass } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useChatStore } from "@/store/useChatStore";

export default function SavedPromptsModal() {
  const { savedPromptsModalOpen, setSavedPromptsModalOpen } = useUIStore();
  const { setInputMessage } = useChatStore();

  const categories = [
    {
      name: "High-Yield FSc Exam Mastery",
      icon: <BookOpen className="w-4 h-4 text-[#b45309]" />,
      prompts: [
        "Derive the formula for relativistic kinetic energy step-by-step for FSc Physics Book 2.",
        "Compare Aldol Condensation with Cannizzaro Reaction mechanisms with IUPAC examples.",
        "Provide a 10-point checklist for solving AC Circuits resonance numericals without errors.",
      ],
    },
    {
      name: "Entry Test Hacks (MDCAT / ECAT)",
      icon: <BrainCircuit className="w-4 h-4 text-[#b45309]" />,
      prompts: [
        "List the 5 most common distractor patterns used in MDCAT Biology genetics questions.",
        "Short-cut techniques for finding determinants of 3x3 matrices in 30 seconds for ECAT.",
        "Compare key thermodynamic cycles (Carnot vs Otto) in tabular format for quick recall.",
      ],
    },
    {
      name: "Synthesize & Organize Notes",
      icon: <Atom className="w-4 h-4 text-[#b45309]" />,
      prompts: [
        "Turn my rough physics notes into a 5-point formula cheat sheet with SI units.",
        "Generate 3 conceptual MCQ scenarios based on Fleming's Right Hand Rule.",
        "Summarize the differences between Mitosis and Meiosis II with high-yield distinctions.",
      ],
    },
  ];

  if (!savedPromptsModalOpen) return null;

  const handleSelectPrompt = (prompt: string) => {
    setInputMessage(prompt);
    setSavedPromptsModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSavedPromptsModalOpen(false)}
          className="absolute inset-0 bg-[#1c1917]/45 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-xl bg-white rounded-3xl p-7 shadow-2xl border border-[#e8dfd1] max-h-[85vh] overflow-y-auto custom-scrollbar"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#f4ede2]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1c1917] text-[#fef3c7] flex items-center justify-center shadow-xs">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#1c1917]">Curated Academic Prompts</h3>
                <p className="text-xs text-[#716a5d]">
                  Click any template to populate your input console instantly.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSavedPromptsModalOpen(false)}
              className="p-1.5 rounded-lg text-[#857d70] hover:text-[#1c1917] hover:bg-[#f6eee2] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Prompt Sections */}
          <div className="mt-5 space-y-6">
            {categories.map((cat, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 text-xs font-bold text-[#453e34] uppercase tracking-wider mb-2.5">
                  {cat.icon}
                  <span>{cat.name}</span>
                </div>
                <div className="space-y-2">
                  {cat.prompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPrompt(p)}
                      className="w-full text-left p-3 rounded-2xl bg-[#faf7f2] hover:bg-[#f6eee2] border border-[#ebe2d4] text-xs text-[#353028] leading-relaxed transition-colors cursor-pointer flex items-center justify-between group"
                    >
                      <span className="font-medium group-hover:text-[#b45309]">{p}</span>
                      <CheckCheck className="w-4 h-4 text-[#b45309] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
