"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MessageSquare, Clock, ArrowRight } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useUIStore } from "@/store/useUIStore";

export default function SearchModal() {
  const { searchModalOpen, setSearchModalOpen } = useUIStore();
  const { sessions, selectSession } = useChatStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSearchModalOpen]);

  if (!searchModalOpen) return null;

  const filtered = sessions.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.messages.some((m) => m.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSearchModalOpen(false)}
          className="absolute inset-0 bg-[#1c1917]/45 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl border border-[#e8dfd1] overflow-hidden"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 pb-3 border-b border-[#f4ece0]">
            <Search className="w-5 h-5 text-[#b45309]" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search chat sessions, formulas, topics..."
              className="w-full bg-transparent border-none outline-none text-sm text-[#1c1917] placeholder-[#9c9385]"
            />
            <button
              type="button"
              onClick={() => setSearchModalOpen(false)}
              className="p-1 rounded-lg text-[#857d71] hover:text-[#1c1917] hover:bg-[#f6efe4] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="mt-3 max-h-72 overflow-y-auto space-y-1 custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#8c8477]">
                No matching chat sessions found.
              </div>
            ) : (
              filtered.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    selectSession(s.id);
                    setSearchModalOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-2xl hover:bg-[#faf7f2] transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-xl bg-[#f6eee2] text-[#78350f] flex items-center justify-center flex-shrink-0 group-hover:bg-[#edd9c0] border border-[#e9ded0]">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-semibold text-xs text-[#201c18] truncate">
                        {s.title}
                      </div>
                      <div className="text-[10px] text-[#827a6f] flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{s.category}</span>
                        <span>•</span>
                        <span>{s.model}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#b45309] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
