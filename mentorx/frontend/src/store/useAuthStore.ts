"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "student";
  studyTrack?: string;
  isBlocked?: boolean;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: (customData?: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  toggleAdminRole: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: {
        id: "admin_001",
        name: "Emerson Sterling",
        email: "sterlingr@gmail.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "admin", // Default with admin privileges for testing the admin portal
        studyTrack: "FSc Pre-Medical",
        isBlocked: false,
      },
      isAuthenticated: true,
      isLoading: false,

      loginWithGoogle: async (customData) => {
        set({ isLoading: true });
        const payload = {
          email: customData?.email || "sterlingr@gmail.com",
          name: customData?.name || "Emerson Sterling",
          avatar:
            customData?.avatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          study_track: customData?.studyTrack || "Pre-Medical",
        };

        try {
          // Attempt backend Google Auth endpoint
          const res = await fetch("http://127.0.0.1:8000/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            const data = await res.json();
            set({
              user: {
                id: data.id,
                name: data.name,
                email: data.email,
                avatar: data.avatar || payload.avatar,
                role: data.role as "admin" | "student",
                studyTrack: data.study_track,
                isBlocked: data.is_blocked,
              },
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        } catch (e) {
          // Offline fallback
        }

        // Fallback local persistence
        const role = customData?.email?.includes("admin") || payload.email.includes("admin") ? "admin" : "student";
        set({
          user: {
            id: `usr_${Date.now()}`,
            name: payload.name,
            email: payload.email,
            avatar: payload.avatar,
            role,
            studyTrack: payload.study_track,
            isBlocked: false,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      updateUserProfile: (profile) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...profile } });
        }
      },

      toggleAdminRole: () => {
        const currentUser = get().user;
        if (currentUser) {
          const newRole = currentUser.role === "admin" ? "student" : "admin";
          set({ user: { ...currentUser, role: newRole } });
        }
      },
    }),
    {
      name: "mentorx-auth-store",
    }
  )
);
