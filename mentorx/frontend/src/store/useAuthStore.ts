import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  grade?: string;
  target?: string;
  provider: "google";
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: (customUser?: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: "usr_emerson_101",
        name: "Emerson Sterling",
        email: "sterlingr@gmail.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        grade: "FSc Pre-Medical / College",
        target: "MDCAT & Top Medical Colleges",
        provider: "google",
      },
      isAuthenticated: true,
      isLoading: false,

      loginWithGoogle: async (customUser) => {
        set({ isLoading: true });
        // Simulate smooth authentic Google OAuth handshake
        await new Promise((resolve) => setTimeout(resolve, 800));

        const newUser: UserProfile = {
          id: customUser?.id || `usr_google_${Date.now()}`,
          name: customUser?.name || "Jackson Sterling",
          email: customUser?.email || "jackson.sterling@gmail.com",
          avatar:
            customUser?.avatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          grade: customUser?.grade || "FSc Pre-Engineering",
          target: customUser?.target || "ECAT / NUST / FAST Prep",
          provider: "google",
        };

        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: "mentorx-auth-storage",
    }
  )
);
