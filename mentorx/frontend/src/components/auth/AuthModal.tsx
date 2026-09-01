"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, GraduationCap } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import GoogleSignInButton from "./GoogleSignInButton";

export default function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, openAuthModal } = useUIStore();
  const [selectedStream, setSelectedStream] = useState<string>("Pre-Medical");

  const streams = [
    { id: "Pre-Medical", label: "FSc Pre-Medical", desc: "MDCAT, Biology & Chem" },
    { id: "Pre-Engineering", label: "FSc Pre-Eng", desc: "ECAT, Math & Physics" },
    { id: "ICS", label: "ICS / Computer", desc: "FAST, NUST CS & Math" },
  ];

  if (!authModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl border border-[#e4e4e7] overflow-hidden"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-6 right-6 p-2 rounded-full text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              <div className="w-2.5 h-6 bg-[#18181b] rounded-2xs transform -skew-x-12" />
              <div className="w-2.5 h-6 bg-[#71717a] rounded-2xs transform -skew-x-12" />
              <div className="w-2.5 h-6 bg-[#d4d4d8] rounded-2xs transform -skew-x-12" />
            </div>
            <span className="font-extrabold text-lg text-[#18181b]">MentorX</span>
          </div>

          <h2 className="text-2xl font-serif font-bold text-[#18181b] tracking-tight">
            {authModalMode === "signup" ? "Create your Student Account" : "Welcome back to MentorX"}
          </h2>
          <p className="text-xs text-[#71717a] mt-1.5 leading-relaxed">
            {authModalMode === "signup"
              ? "Join thousands of FSc students mastering concepts and crushing entry tests with AI guidance."
              : "Sign in instantly with your Google account to access your personal academic workspace."}
          </p>

          {/* Academic Stream Selector (When signing up) */}
          {authModalMode === "signup" && (
            <div className="mt-6">
              <label className="block text-xs font-semibold text-[#18181b] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                <GraduationCap className="w-3.5 h-3.5" /> Select Your Study Track
              </label>
              <div className="grid grid-cols-3 gap-2">
                {streams.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedStream(s.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedStream === s.id
                        ? "border-[#18181b] bg-[#18181b] text-white shadow-xs"
                        : "border-[#e4e4e7] bg-[#fafafa] text-[#52525b] hover:bg-[#f4f4f5]"
                    }`}
                  >
                    <div className="font-semibold text-xs truncate">{s.label}</div>
                    <div className={`text-[10px] truncate mt-0.5 ${selectedStream === s.id ? "text-[#d4d4d8]" : "text-[#a1a1aa]"}`}>
                      {s.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Google Auth Button (Google-Only Auth Requirement) */}
          <div className="mt-7 space-y-3">
            <GoogleSignInButton
              label={authModalMode === "signup" ? "Sign up with Google" : "Sign in with Google"}
              variant="outline"
              studyTrack={selectedStream}
            />
          </div>

          {/* Mode Switcher */}
          <div className="mt-6 text-center text-xs text-[#71717a]">
            {authModalMode === "signup" ? (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => openAuthModal("signin")}
                  className="text-[#18181b] font-semibold underline cursor-pointer"
                >
                  Sign in with Google
                </button>
              </span>
            ) : (
              <span>
                New to MentorX?{" "}
                <button
                  type="button"
                  onClick={() => openAuthModal("signup")}
                  className="text-[#18181b] font-semibold underline cursor-pointer"
                >
                  Create account with Google
                </button>
              </span>
            )}
          </div>

          {/* Security & Privacy Notice */}
          <div className="mt-6 pt-4 border-t border-[#f4f4f5] flex items-center justify-center gap-2 text-[11px] text-[#a1a1aa]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#15803d]" />
            <span>Secure 1-click Google OAuth • No passwords required</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
