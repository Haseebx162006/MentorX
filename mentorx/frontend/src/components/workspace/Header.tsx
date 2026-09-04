"use client";

import React, { useState } from "react";
import {
  Link as LinkIcon,
  Download,
  Check,
  ShieldCheck,
  User,
} from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function Header() {
  const { setExportModalOpen, openAuthModal, setCurrentView } = useUIStore();
  const { user } = useAuthStore();
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAdminClick = () => {
    if (user?.role === "admin") {
      setCurrentView("admin");
    } else {
      openAuthModal("signin");
    }
  };

  return (
    <header className="h-14 px-4 sm:px-8 border-b border-[#f4f4f5] flex items-center justify-between bg-white select-none">
      {/* Left: Claude-Style Minimal MentorX Indicator */}
      <div className="flex items-center gap-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f4f4f5] border border-[#e4e4e7] text-xs font-semibold text-[#18181b]">
          <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>MentorX AI</span>
          <span className="text-[10px] text-[#71717a] font-normal font-mono bg-white px-1.5 py-0.5 rounded border border-[#e4e4e7]">
            RAG Active
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Prominent Admin Portal Access Button */}
        <button
          type="button"
          onClick={handleAdminClick}
          title="Enter Admin Management Dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18181b] hover:bg-[#27272a] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Admin Portal</span>
          {user?.role === "admin" && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          )}
        </button>

        {/* Link Share */}
        <button
          type="button"
          onClick={handleCopyLink}
          title="Copy Link"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
        >
          {copiedLink ? (
            <Check className="w-4 h-4 text-emerald-600" />
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
          <span className="hidden sm:inline">Export chat</span>
        </button>

        {/* Account Button / Avatar */}
        <button
          type="button"
          onClick={() => openAuthModal("signin")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e4e4e7] bg-white text-xs font-semibold text-[#18181b] hover:bg-[#f4f4f5] active:scale-95 transition-all shadow-2xs cursor-pointer"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || "User"}
              className="w-4 h-4 rounded-full object-cover"
            />
          ) : (
            <User className="w-3.5 h-3.5 text-[#71717a]" />
          )}
          <span>{user?.name?.split(" ")[0] || "Account"}</span>
        </button>
      </div>
    </header>
  );
}
