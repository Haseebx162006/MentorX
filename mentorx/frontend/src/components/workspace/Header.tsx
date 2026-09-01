"use client";

import React, { useState } from "react";
import {
  MoreHorizontal,
  Link as LinkIcon,
  Download,
  Check,
  Sparkles,
} from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

export default function Header() {
  const { setExportModalOpen, openAuthModal } = useUIStore();
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <header className="h-14 px-6 border-b border-[#f4f4f5] flex items-center justify-between bg-white select-none">
      {/* Left: Clean MentorX Badge (No hardcoded model dropdown) */}
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f4f4f5] border border-[#e4e4e7] text-xs font-semibold text-[#18181b]">
          <div className="w-2 h-2 rounded-full bg-[#15803d]" />
          <span>MentorX AI</span>
          <span className="text-[10px] text-[#71717a] font-normal font-mono bg-white px-1.5 py-0.5 rounded border border-[#e4e4e7]">
            RAG Active
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
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

        {/* Sign In / Profile Modal */}
        <button
          type="button"
          onClick={() => openAuthModal("signin")}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#18181b] text-white text-xs font-semibold hover:bg-[#27272a] active:scale-95 transition-all shadow-2xs cursor-pointer ml-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Account</span>
        </button>
      </div>
    </header>
  );
}
