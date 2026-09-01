"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { AlertCircle, Loader2, Mail, Info } from "lucide-react";

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleSignInButtonProps {
  label?: string;
  variant?: "primary" | "outline" | "pill";
  studyTrack?: string;
  onSuccess?: () => void;
}

export default function GoogleSignInButton({
  label = "Continue with Google",
  variant = "outline",
  studyTrack = "Pre-Medical",
  onSuccess,
}: GoogleSignInButtonProps) {
  const { loginWithGoogle, isLoading, authError, clearAuthError } = useAuthStore();
  const { closeAuthModal, setCurrentView } = useUIStore();
  const [gisLoaded, setGisLoaded] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  // Load Google Identity Services (GIS) client script
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google?.accounts?.oauth2) {
      setGisLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGisLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  // Handle Google OAuth 2.0 Popup Login
  const handleGoogleOAuthPopup = () => {
    clearAuthError();

    if (!googleClientId || !window.google?.accounts?.oauth2) {
      // If Client ID is not configured yet, switch to direct Google Email authentication
      setShowEmailInput(true);
      return;
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid",
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            console.error("Google OAuth error:", tokenResponse);
            return;
          }

          try {
            // Fetch verified user profile directly from Google
            const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });

            if (userInfoRes.ok) {
              const profile = await userInfoRes.json();
              const success = await loginWithGoogle({
                token: tokenResponse.access_token,
                email: profile.email,
                name: profile.name,
                avatar: profile.picture,
                studyTrack,
              });

              if (success) {
                closeAuthModal();
                setCurrentView("workspace");
                if (onSuccess) onSuccess();
              }
            }
          } catch (err: any) {
            console.error("Error fetching Google profile:", err);
          }
        },
      });

      client.requestAccessToken();
    } catch (err: any) {
      console.error("GIS initialization failed:", err);
      setShowEmailInput(true);
    }
  };

  // Direct authentication with backend via email (connects to PostgreSQL via FastAPI)
  const handleDirectAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;

    const email = customEmail.trim();
    const name = customName.trim() || email.split("@")[0];

    const success = await loginWithGoogle({
      email,
      name,
      studyTrack,
    });

    if (success) {
      closeAuthModal();
      setCurrentView("workspace");
      if (onSuccess) onSuccess();
    }
  };

  const baseStyles =
    "w-full inline-flex items-center justify-center gap-3 font-medium transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none";

  const variants = {
    primary:
      "py-3 px-5 rounded-2xl bg-[#1c1926] text-white hover:bg-[#2b2738] shadow-md hover:shadow-lg text-sm",
    outline:
      "py-3 px-5 rounded-2xl bg-white border border-[#e1dbe9] text-[#1c1926] hover:bg-[#faf7fd] hover:border-[#cfc4dd] shadow-sm text-sm",
    pill:
      "py-2 px-4 rounded-full bg-white border border-[#e4ddf0] text-[#221f2d] hover:bg-[#f6f2fc] text-xs font-semibold shadow-sm",
  };

  return (
    <div className="w-full space-y-3">
      {authError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="leading-snug">{authError}</span>
        </div>
      )}

      {/* Main Google Sign In Button */}
      <button
        type="button"
        onClick={handleGoogleOAuthPopup}
        disabled={isLoading}
        className={`${baseStyles} ${variants[variant]}`}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-[#18181b]" />
        ) : (
          /* Official Google SVG Multi-color Icon */
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{isLoading ? "Signing in..." : label}</span>
      </button>

      {/* If Google Client ID is missing, provide direct email input to test backend connection */}
      {!googleClientId && (
        <div className="pt-2 border-t border-[#f4f4f5]">
          {!showEmailInput ? (
            <button
              type="button"
              onClick={() => setShowEmailInput(true)}
              className="text-[11px] text-[#71717a] hover:text-[#18181b] flex items-center justify-center gap-1.5 w-full cursor-pointer py-1"
            >
              <Mail className="w-3 h-3" />
              <span>Or sign in with Google email directly</span>
            </button>
          ) : (
            <form onSubmit={handleDirectAuth} className="space-y-2 text-left pt-1">
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>
                  Provide <strong>NEXT_PUBLIC_GOOGLE_CLIENT_ID</strong> in <code>.env.local</code> for Google popup, or enter your Google email below to connect directly to the database.
                </span>
              </div>
              <input
                type="email"
                required
                placeholder="your.email@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#e4e4e7] rounded-xl focus:outline-hidden focus:border-[#18181b] bg-white"
              />
              <input
                type="text"
                placeholder="Your Full Name (Optional)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#e4e4e7] rounded-xl focus:outline-hidden focus:border-[#18181b] bg-white"
              />
              <button
                type="submit"
                disabled={isLoading || !customEmail}
                className="w-full py-2 px-3 rounded-xl bg-[#18181b] text-white text-xs font-semibold hover:bg-[#27272a] disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Authenticating with Backend..." : "Authenticate with Backend Database"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
