"use client";

import React, { useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Globe,
  BookOpen,
  FolderClosed,
  History,
  PanelLeftClose,
  LogOut,
  Shield,
  ShieldCheck,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";

export default function Sidebar() {
  const {
    sessions,
    activeSessionId,
    selectSession,
    createNewChat,
    deleteSession,
    loadUserSessions,
  } = useChatStore();

  const { user, logout } = useAuthStore();
  const {
    sidebarCollapsed,
    toggleSidebar,
    setSearchModalOpen,
    openAuthModal,
    setCurrentView,
  } = useUIStore();

  const historySectionRef = useRef<HTMLDivElement>(null);

  // Fetch chat sessions from backend on mount and user change
  useEffect(() => {
    loadUserSessions(user?.id);
  }, [user?.id, loadUserSessions]);

  const todaySessions = sessions.filter((s) => s.category === "Today");
  const yesterdaySessions = sessions.filter((s) => s.category === "Yesterday");
  const weekSessions = sessions.filter((s) => s.category === "7 days");
  const olderSessions = sessions.filter((s) => s.category === "Older");

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    deleteSession(sessionId);
  };

  const handleHistoryClick = () => {
    setSearchModalOpen(true);
  };

  const renderSessionItem = (session: (typeof sessions)[0]) => {
    const isActive = activeSessionId === session.id;
    return (
      <div
        key={session.id}
        onClick={() => selectSession(session.id)}
        className={`group relative flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
          isActive
            ? "bg-[#f4f4f5] text-[#18181b] font-semibold"
            : "text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b]"
        }`}
      >
        <span className="truncate pr-5 flex-1">{session.title}</span>
        <button
          type="button"
          onClick={(e) => handleDelete(e, session.id)}
          title="Delete Conversation"
          className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 hover:bg-red-50 rounded-md transition-opacity cursor-pointer flex-shrink-0"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  };

  if (sidebarCollapsed) {
    return (
      <aside className="w-16 h-full bg-[#fcfcfc] border-r border-[#e4e4e7] flex flex-col items-center py-4 justify-between transition-all select-none">
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={toggleSidebar}
            title="Expand Sidebar"
            className="w-9 h-9 rounded-xl bg-[#18181b] text-white flex items-center justify-center hover:bg-[#27272a] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-0.5">
              <div className="w-1.5 h-3.5 bg-white rounded-2xs transform -skew-x-12" />
              <div className="w-1.5 h-3.5 bg-[#a1a1aa] rounded-2xs transform -skew-x-12" />
            </div>
          </button>
          <button
            type="button"
            onClick={createNewChat}
            title="New Chat"
            className="w-9 h-9 rounded-xl bg-[#18181b] text-white flex items-center justify-center hover:bg-[#27272a] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            title="Search Chats & History (⌘K)"
            className="w-9 h-9 rounded-xl text-[#71717a] hover:bg-[#f4f4f5] flex items-center justify-center transition-colors cursor-pointer"
          >
            <History className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (user?.role === "admin") {
                setCurrentView("admin");
              } else {
                openAuthModal("signin");
              }
            }}
            title="Admin Portal"
            className="w-9 h-9 rounded-xl text-[#18181b] bg-white border border-[#e4e4e7] hover:bg-[#f4f4f5] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt="User"
            className="w-8 h-8 rounded-full object-cover border border-[#e4e4e7] shadow-2xs cursor-pointer"
            onClick={() => openAuthModal("signin")}
          />
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 h-full bg-[#fcfcfc] border-r border-[#e4e4e7] flex flex-col justify-between select-none transition-all">
      {/* Top Section */}
      <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
        {/* Brand & Collapse Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-0.5">
              <div className="w-2 h-5 bg-[#18181b] rounded-2xs transform -skew-x-12" />
              <div className="w-2 h-5 bg-[#71717a] rounded-2xs transform -skew-x-12" />
              <div className="w-2 h-5 bg-[#d4d4d8] rounded-2xs transform -skew-x-12" />
            </div>
            <span className="font-extrabold text-base text-[#18181b] tracking-tight">MentorX</span>
          </div>

          <button
            type="button"
            onClick={toggleSidebar}
            title="Collapse Sidebar"
            className="p-1.5 rounded-lg text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* + New Chat Button */}
        <button
          type="button"
          onClick={createNewChat}
          className="w-full py-2.5 px-4 rounded-xl bg-[#18181b] text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#27272a] active:scale-[0.98] transition-all shadow-xs cursor-pointer mb-3.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New chat</span>
        </button>

        {/* Search Bar with ⌘K Badge */}
        <button
          type="button"
          onClick={() => setSearchModalOpen(true)}
          className="w-full py-2 px-3 rounded-xl bg-white border border-[#e4e4e7] text-xs text-[#71717a] flex items-center justify-between hover:border-[#a1a1aa] hover:bg-[#fafafa] transition-colors cursor-pointer mb-4 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#a1a1aa]" />
            <span>Search</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded-md bg-[#f4f4f5] text-[10px] font-mono text-[#52525b] border border-[#e4e4e7]">
            ⌘K
          </kbd>
        </button>

        {/* Navigation Items */}
        <nav className="space-y-1 mb-5 text-xs font-medium text-[#52525b]">
          <button
            type="button"
            onClick={() => setCurrentView("landing")}
            className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors cursor-pointer text-left"
          >
            <Globe className="w-4 h-4 text-[#71717a]" />
            <span>Explore Universities</span>
          </button>

          <button
            type="button"
            onClick={handleHistoryClick}
            className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors cursor-pointer text-left"
          >
            <History className="w-4 h-4 text-[#71717a]" />
            <span>Chat History</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView("landing")}
            className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors cursor-pointer text-left"
          >
            <BookOpen className="w-4 h-4 text-[#71717a]" />
            <span>Prospectus Library</span>
          </button>
        </nav>

        {/* Chat History Grouping */}
        <div ref={historySectionRef} className="space-y-4 pt-2 border-t border-[#f4f4f5]">
          <div className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider px-2.5 font-mono">
            Recent Conversations
          </div>

          {todaySessions.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-[#71717a] px-2.5 mb-1">
                Today
              </div>
              <div className="space-y-0.5">{todaySessions.map(renderSessionItem)}</div>
            </div>
          )}

          {yesterdaySessions.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-[#71717a] px-2.5 mb-1">
                Yesterday
              </div>
              <div className="space-y-0.5">{yesterdaySessions.map(renderSessionItem)}</div>
            </div>
          )}

          {weekSessions.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-[#71717a] px-2.5 mb-1">
                Last 7 Days
              </div>
              <div className="space-y-0.5">{weekSessions.map(renderSessionItem)}</div>
            </div>
          )}

          {olderSessions.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-[#71717a] px-2.5 mb-1">
                Older
              </div>
              <div className="space-y-0.5">{olderSessions.map(renderSessionItem)}</div>
            </div>
          )}

          {sessions.length === 0 && (
            <div className="px-2.5 py-4 text-center border border-dashed border-[#e4e4e7] rounded-2xl bg-white/50">
              <MessageSquare className="w-4 h-4 text-[#a1a1aa] mx-auto mb-1.5" />
              <p className="text-[11px] text-[#71717a] font-medium">No previous conversations</p>
              <p className="text-[9px] text-[#a1a1aa] mt-0.5">Click + New chat to begin</p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Portal Quick Access */}
      <div className="px-3 pt-2 pb-1 bg-[#fcfcfc]">
        <button
          type="button"
          onClick={() => {
            if (user?.role === "admin") {
              setCurrentView("admin");
            } else {
              openAuthModal("signin");
            }
          }}
          title="Open Admin Dashboard"
          className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#f4f4f5] text-[#18181b] text-xs font-semibold flex items-center justify-between transition-all cursor-pointer border border-[#e4e4e7] shadow-2xs group active:scale-[0.98]"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Admin Dashboard</span>
          </div>
          <span className="text-[9px] font-mono bg-[#18181b] text-white px-1.5 py-0.5 rounded font-bold">
            PORTAL
          </span>
        </button>
      </div>

      {/* Bottom Profile Card */}
      <div className="p-3 border-t border-[#e4e4e7] bg-[#fafafa]">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-white border border-[#e4e4e7] shadow-2xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={user?.name || "Student"}
              className="w-8 h-8 rounded-full object-cover border border-[#e4e4e7] flex-shrink-0"
            />
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-[#18181b] truncate flex items-center gap-1">
                <span>{user?.name || "Student"}</span>
                {user?.role === "admin" && (
                  <button
                    type="button"
                    onClick={() => setCurrentView("admin")}
                    title="Open Admin Portal"
                    className="text-[8px] font-mono bg-[#18181b] text-white px-1.5 py-0.5 rounded font-bold cursor-pointer hover:bg-[#3f3f46]"
                  >
                    ADMIN
                  </button>
                )}
              </div>
              <div className="text-[10px] text-[#71717a] truncate">
                {user?.email || "student@mentorx.edu"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              setCurrentView("landing");
            }}
            title="Sign Out"
            className="p-1.5 rounded-lg text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors cursor-pointer flex-shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
