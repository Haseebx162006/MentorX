"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, HelpCircle, Keyboard, Compass } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

export default function HelpModal() {
  const { helpModalOpen, setHelpModalOpen } = useUIStore();

  if (!helpModalOpen) return null;

  const shortcuts = [
    { key: "Enter", action: "Send prompt message" },
    { key: "Shift + Enter", action: "Insert new line in input" },
    { key: "⌘K / Ctrl+K", action: "Open quick chat search" },
    { key: "Esc", action: "Close modal / dialog" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setHelpModalOpen(false)}
          className="absolute inset-0 bg-[#1c1917]/45 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-md bg-white rounded-3xl p-7 shadow-2xl border border-[#e8dfd1]"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#f4ede2]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1c1917] text-[#fef3c7] flex items-center justify-center shadow-xs">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-[#1c1917]">MentorX Tips & Shortcuts</h3>
            </div>

            <button
              type="button"
              onClick={() => setHelpModalOpen(false)}
              className="p-1.5 rounded-lg text-[#857d70] hover:text-[#1c1917] hover:bg-[#f6eee2] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="mt-5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#453e34] uppercase tracking-wider mb-2.5">
              <Keyboard className="w-3.5 h-3.5 text-[#b45309]" /> Keyboard Shortcuts
            </div>
            <div className="space-y-1.5">
              {shortcuts.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#faf7f2] text-xs text-[#353028]"
                >
                  <span>{s.action}</span>
                  <kbd className="px-2 py-0.5 rounded-md bg-white border border-[#e5dcd0] text-[10px] font-mono font-bold text-[#78350f]">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features Quick Guide */}
          <div className="mt-5 pt-4 border-t border-[#f4ede2]">
            <div className="text-xs font-bold text-[#453e34] uppercase tracking-wider mb-2">
              Pro Guidance Features
            </div>
            <div className="space-y-2 text-xs text-[#686155] leading-relaxed">
              <p>
                • <strong>Deeper Research</strong>: Triggers multi-step derivation across syllabus books and entry test papers.
              </p>
              <p>
                • <strong>Web Search</strong>: Gathers the latest admission dates, merit lists, and supplementary formulas.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
