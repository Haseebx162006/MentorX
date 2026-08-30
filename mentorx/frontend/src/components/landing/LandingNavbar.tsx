"use client";

import React from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function LandingNavbar() {
  const { openAuthModal, setCurrentView } = useUIStore();
  const { isAuthenticated } = useAuthStore();

  return (
    <header className="w-full px-6 py-5 flex items-center justify-between bg-transparent select-none">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        {/* Minimalist Geometric Feathers/Layers Mark from Reference */}
        <div className="flex items-center gap-0.5">
          <div className="w-2.5 h-6 bg-[#18181b] rounded-sm transform -skew-x-12" />
          <div className="w-2.5 h-6 bg-[#71717a] rounded-sm transform -skew-x-12" />
          <div className="w-2.5 h-6 bg-[#d4d4d8] rounded-sm transform -skew-x-12" />
        </div>
        <span className="font-extrabold text-xl tracking-tight text-[#18181b]">
          MentorX
        </span>
      </div>

      {/* Center Navigation Links */}
      <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#52525b]">
        <a href="#technology" className="hover:text-[#18181b] transition-colors">
          Technology
        </a>
        <a href="#curriculum" className="hover:text-[#18181b] transition-colors">
          Curriculum RAG
        </a>
        <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#18181b] transition-colors">
          <span>Academic Tracks</span>
          <ChevronDown className="w-3 h-3 text-[#71717a]" />
        </div>
        <a href="#resources" className="hover:text-[#18181b] transition-colors">
          Resources
        </a>
        <a href="#about" className="hover:text-[#18181b] transition-colors">
          About Us
        </a>
      </nav>

      {/* Right CTA Button */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <button
            type="button"
            onClick={() => setCurrentView("workspace")}
            className="px-5 py-2.5 rounded-full bg-[#18181b] text-white text-xs font-semibold hover:bg-[#27272a] transition-all shadow-xs cursor-pointer flex items-center gap-2"
          >
            <span>Open Workspace</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal("signin")}
            className="px-6 py-2.5 rounded-full bg-[#18181b] text-white text-xs font-semibold hover:bg-[#27272a] active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            Request demo
          </button>
        )}
      </div>
    </header>
  );
}
