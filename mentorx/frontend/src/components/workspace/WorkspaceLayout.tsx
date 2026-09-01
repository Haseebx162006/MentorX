"use client";

import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import GlowingOrb from "./GlowingOrb";
import PromptInput from "./PromptInput";
import StarterCards from "./StarterCards";
import ChatThread from "./ChatThread";
import SearchModal from "../modals/SearchModal";
import SavedPromptsModal from "../modals/SavedPromptsModal";
import ExportModal from "../modals/ExportModal";
import HelpModal from "../modals/HelpModal";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { Languages } from "lucide-react";

export default function WorkspaceLayout() {
  const { activeSessionId, sessions } = useChatStore();
  const { user, isAuthenticated } = useAuthStore();
  const { setHelpModalOpen, language, setLanguage, setCurrentView, openAuthModal } = useUIStore();

  // Protect workspace: if unauthenticated, redirect to landing & prompt login
  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentView("landing");
      openAuthModal("signin");
    }
  }, [isAuthenticated, setCurrentView, openAuthModal]);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const hasMessages = activeSession && activeSession.messages.length > 0;

  const toggleLang = () => {
    setLanguage(language === "en" ? "ur" : "en");
  };

  return (
    <div className="w-screen h-screen bg-[#fcfcfc] flex overflow-hidden select-none">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">
        {/* Pinned Top Navigation Bar */}
        <div className="flex-shrink-0 w-full z-20">
          <Header />
        </div>

        {/* Center Workspace Body */}
        {!hasMessages ? (
          /* Welcome Screen View */
          <div className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-8 py-2 custom-scrollbar flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl flex flex-col items-center text-center my-auto">
              {/* 3D Kinetic Core */}
              <GlowingOrb />

              {/* Greeting Typography */}
              <div className="mb-4">
                <h2 className="text-sm sm:text-base font-medium text-[#71717a] tracking-tight">
                  Hello, {user?.name?.split(" ")[0] || "there"}
                </h2>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#18181b] tracking-tight mt-0.5">
                  How can I assist you today?
                </h1>
              </div>

              {/* Central Floating Prompt Input */}
              <div className="w-full">
                <PromptInput />
              </div>

              {/* 3 Starter Prompt Suggestion Cards */}
              <StarterCards />
            </div>
          </div>
        ) : (
          /* Active Chat Thread View */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            {/* Scrollable Messages Area */}
            <ChatThread />

            {/* Floating Bottom Prompt Bar with Fade Backdrop */}
            <div className="absolute bottom-0 left-0 right-0 w-full px-4 sm:px-8 pb-3 pt-6 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none z-10">
              <div className="max-w-3xl mx-auto pointer-events-auto">
                <PromptInput />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Footer Bar */}
        <footer className="h-9 px-6 border-t border-[#f4f4f5] flex items-center justify-between text-xs text-[#71717a] bg-white select-none flex-shrink-0 z-20">
          {/* Discord Community */}
          <div className="text-[11px] text-[#71717a] flex items-center gap-1">
            <span>Join the MentorX community for admission updates</span>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#18181b] font-semibold hover:underline cursor-pointer ml-1"
            >
              Join Discord
            </a>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLang}
              title="Switch Language (English / Urdu)"
              className="p-1 rounded-md text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors cursor-pointer text-[11px] font-semibold flex items-center gap-1"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{language === "en" ? "文A" : "اردو"}</span>
            </button>

            {/* Help & Shortcuts Button */}
            <button
              type="button"
              onClick={() => setHelpModalOpen(true)}
              title="Help & Shortcuts (?)"
              className="w-5 h-5 rounded-full flex items-center justify-center text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors cursor-pointer text-xs font-semibold"
            >
              ?
            </button>
          </div>
        </footer>
      </div>

      {/* Workspace Modals */}
      <SearchModal />
      <SavedPromptsModal />
      <ExportModal />
      <HelpModal />
    </div>
  );
}
