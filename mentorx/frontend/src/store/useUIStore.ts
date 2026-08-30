import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppView = "loader" | "landing" | "workspace";

interface UIState {
  currentView: AppView;
  hasSeenLoader: boolean;
  sidebarCollapsed: boolean;
  authModalOpen: boolean;
  authModalMode: "signin" | "signup";
  searchModalOpen: boolean;
  savedPromptsModalOpen: boolean;
  exportModalOpen: boolean;
  helpModalOpen: boolean;
  theme: "light" | "dark";
  language: "en" | "ur";

  setCurrentView: (view: AppView) => void;
  finishLoader: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openAuthModal: (mode?: "signin" | "signup") => void;
  closeAuthModal: () => void;
  setSearchModalOpen: (open: boolean) => void;
  setSavedPromptsModalOpen: (open: boolean) => void;
  setExportModalOpen: (open: boolean) => void;
  setHelpModalOpen: (open: boolean) => void;
  toggleTheme: () => void;
  setLanguage: (lang: "en" | "ur") => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      currentView: "loader",
      hasSeenLoader: false,
      sidebarCollapsed: false,
      authModalOpen: false,
      authModalMode: "signin",
      searchModalOpen: false,
      savedPromptsModalOpen: false,
      exportModalOpen: false,
      helpModalOpen: false,
      theme: "light",
      language: "en",

      setCurrentView: (view) => set({ currentView: view }),
      finishLoader: () => set({ currentView: "landing", hasSeenLoader: true }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      openAuthModal: (mode = "signin") => set({ authModalOpen: true, authModalMode: mode }),
      closeAuthModal: () => set({ authModalOpen: false }),
      setSearchModalOpen: (open) => set({ searchModalOpen: open }),
      setSavedPromptsModalOpen: (open) => set({ savedPromptsModalOpen: open }),
      setExportModalOpen: (open) => set({ exportModalOpen: open }),
      setHelpModalOpen: (open) => set({ helpModalOpen: open }),
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "mentorx-ui-storage",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);
