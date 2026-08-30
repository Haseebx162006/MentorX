"use client";

import { create } from "zustand";

interface UIState {
  // Navigation View: "loader" | "landing" | "workspace" | "admin"
  currentView: "loader" | "landing" | "workspace" | "admin";
  setCurrentView: (view: "loader" | "landing" | "workspace" | "admin") => void;

  // Loader State
  loaderFinished: boolean;
  finishLoader: () => void;

  // Sidebar State
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Modal States
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;

  savedPromptsModalOpen: boolean;
  setSavedPromptsModalOpen: (open: boolean) => void;

  exportModalOpen: boolean;
  setExportModalOpen: (open: boolean) => void;

  helpModalOpen: boolean;
  setHelpModalOpen: (open: boolean) => void;

  authModalOpen: boolean;
  authModalMode: "signin" | "signup";
  openAuthModal: (mode?: "signin" | "signup") => void;
  closeAuthModal: () => void;

  // Language: "en" | "ur"
  language: "en" | "ur";
  setLanguage: (lang: "en" | "ur") => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentView: "loader",
  setCurrentView: (view) => set({ currentView: view }),

  loaderFinished: false,
  finishLoader: () => set({ loaderFinished: true, currentView: "landing" }),

  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  searchModalOpen: false,
  setSearchModalOpen: (open) => set({ searchModalOpen: open }),

  savedPromptsModalOpen: false,
  setSavedPromptsModalOpen: (open) => set({ savedPromptsModalOpen: open }),

  exportModalOpen: false,
  setExportModalOpen: (open) => set({ exportModalOpen: open }),

  helpModalOpen: false,
  setHelpModalOpen: (open) => set({ helpModalOpen: open }),

  authModalOpen: false,
  authModalMode: "signin",
  openAuthModal: (mode = "signin") => set({ authModalOpen: true, authModalMode: mode }),
  closeAuthModal: () => set({ authModalOpen: false }),

  language: "en",
  setLanguage: (lang) => set({ language: lang }),
}));
