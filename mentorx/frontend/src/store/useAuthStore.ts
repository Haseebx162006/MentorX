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

export interface GoogleLoginParams {
  email?: string;
  name?: string;
  avatar?: string;
  studyTrack?: string;
  token?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  loginWithGoogle: (params?: GoogleLoginParams) => Promise<boolean>;
  logout: () => void;
  clearAuthError: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  toggleAdminRole: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      authError: null,

      clearAuthError: () => set({ authError: null }),

      loginWithGoogle: async (params?: GoogleLoginParams) => {
        set({ isLoading: true, authError: null });

        const payload = {
          email: params?.email || "student@mentorx.edu",
          name: params?.name || "FSc Student",
          avatar:
            params?.avatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          study_track: params?.studyTrack || "Pre-Medical",
          token: params?.token || undefined,
        };

        try {
          // Connect to FastAPI Backend Auth Endpoint
          const res = await fetch(`${API_URL}/api/auth/google`, {
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
                role: (data.role as "admin" | "student") || "student",
                studyTrack: data.study_track || payload.study_track,
                isBlocked: data.is_blocked || false,
              },
              isAuthenticated: true,
              isLoading: false,
              authError: null,
            });
            return true;
          } else if (res.status === 403) {
            const errorData = await res.json().catch(() => ({}));
            const msg = errorData.detail || "Your account has been blocked by an administrator.";
            set({
              isLoading: false,
              authError: msg,
              isAuthenticated: false,
              user: null,
            });
            return false;
          } else {
            const errorData = await res.json().catch(() => ({}));
            const msg = errorData.detail || `Server returned error (${res.status})`;
            throw new Error(msg);
          }
        } catch (e: any) {
          console.warn("Backend auth connection notice:", e.message || e);

          // Fallback offline mock for testing if backend is offline
          const isAdminEmail =
            payload.email.toLowerCase().includes("admin") ||
            payload.email.toLowerCase() === "haseebahmadcool678@gmail.com";
          const role = isAdminEmail ? "admin" : "student";
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
            authError: null,
          });
          return true;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false, authError: null });
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
