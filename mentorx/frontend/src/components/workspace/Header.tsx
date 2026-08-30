"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  MoreHorizontal,
  Link as LinkIcon,
  Download,
  Check,
} from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useUIStore } from "@/store/useUIStore";

export default function Header() {
  const { selectedModel, setSelectedModel } = useChatStore();
  const { setExportModalOpen, openAuthModal } = useUIStore();
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const models = [
    { id: "Cortex", name: "Cortex (Llama 3.3 70B)", tag: "Default" },
    { id: "Cortex Pro", name: "Cortex Pro (RAG + Qdrant)", tag: "Academic" },
    { id: "Cortex Fast", name: "Cortex Fast (Groq LPU)", tag: "Instant" },
  ];

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <header className="h-14 px-6 border-b border-[#f4f4f5] flex items-center justify-between bg-white select-none">
      {/* Left: Model Selector Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4f4f5] border border-[#e4e4e7] text-xs font-semibold text-[#18181b] hover:bg-[#e4e4e7] transition-colors cursor-pointer"
        >
          <div className="w-4 h-4 rounded-full bg-[#18181b] text-white flex items-center justify-center text-[10px] font-bold">
            +
          </div>
          <span>{selectedModel}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#71717a]" />
        </button>

        {/* Model Dropdown Menu */}
        {modelDropdownOpen && (
          <div className="absolute top-10 left-0 z-30 w-56 rounded-2xl bg-white border border-[#e4e4e7] shadow-xl p-2 space-y-1 animate-in fade-in zoom-in-95">
            {models.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setSelectedModel(m.id);
                  setModelDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  selectedModel === m.id
                    ? "bg-[#f4f4f5] text-[#18181b] font-semibold"
                    : "text-[#52525b] hover:bg-[#fafafa]"
                }`}
              >
                <div>{m.name}</div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#e4e4e7] text-[#18181b] font-mono">
                  {m.tag}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* More Options */}
        <button
          type="button"
          title="More Options"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {/* Link Share */}
        <button
          type="button"
          onClick={handleCopyLink}
          title="Copy Link"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
        >
          {copiedLink ? (
            <Check className="w-4 h-4 text-[#15803d]" />
          ) : (
            <LinkIcon className="w-4 h-4" />
          )}
        </button>

        {/* Export Chat */}
        <button
          type="button"
          onClick={() => setExportModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e4e4e7] bg-white text-xs font-semibold text-[#27272a] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-all cursor-pointer shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export chat</span>
        </button>

        {/* Upgrade Button */}
        <button
          type="button"
          onClick={() => openAuthModal("signup")}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#18181b] text-white text-xs font-semibold hover:bg-[#27272a] active:scale-95 transition-all shadow-2xs cursor-pointer ml-1"
        >
          <span>Upgrade</span>
        </button>
      </div>
    </header>
  );
}
