"use client";

import React from "react";
import { motion } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";
import IsometricIllustration from "./IsometricIllustration";

export default function HeroSection() {
  const { openAuthModal, setCurrentView } = useUIStore();
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="relative pt-6 pb-16 overflow-hidden">
      <div className="w-full px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[500px]">
          {/* Left Column: Reference-Matched Editorial Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 text-left max-w-xl"
          >
            {/* Target Audience Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4f4f5] border border-[#e4e4e7] text-[#52525b] text-xs font-semibold mb-5 font-mono">
              <span>🎓 FSc, ICS & O/A-Level Admission Mentor</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-medium tracking-tight text-[#18181b] leading-[1.12]">
              <span className="font-serif block text-[#18181b]">
                Safeguard your university admission
              </span>
              <span className="block mt-1">
                with intelligent{" "}
                <span className="text-[#a1a1aa] italic font-serif font-normal">and</span>
              </span>
              <span className="text-[#a1a1aa] font-serif font-normal block mt-1">
                personalized mentorship
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-xs sm:text-sm text-[#71717a] leading-relaxed max-w-md font-normal">
              Find compatible universities matching your FSc marks & A-Level grades. Get verified aggregate calculations, historical closing merit cutoffs, fee structures, and customized career roadmaps.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthModal("signin");
                  } else {
                    setCurrentView("workspace");
                  }
                }}
                className="px-7 py-3 rounded-full bg-[#18181b] text-white text-xs font-semibold hover:bg-[#27272a] active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                Find Compatible Universities
              </button>

              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => openAuthModal("signin")}
                  className="px-7 py-3 rounded-full bg-white border border-[#e4e4e7] text-[#27272a] text-xs font-semibold hover:bg-[#fafafa] hover:border-[#d4d4d8] active:scale-95 transition-all shadow-2xs cursor-pointer"
                >
                  Sign in with Google
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentView("workspace")}
                  className="px-7 py-3 rounded-full bg-white border border-[#e4e4e7] text-[#27272a] text-xs font-semibold hover:bg-[#fafafa] hover:border-[#d4d4d8] active:scale-95 transition-all shadow-2xs cursor-pointer"
                >
                  Open Chatbot
                </button>
              )}
            </div>

            {/* Key Trust Signals */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[#71717a]">
              <span>✓ Verified Merit Cutoffs</span>
              <span>•</span>
              <span>✓ 50+ Top Pakistani & Global Universities</span>
              <span>•</span>
              <span>✓ 100% Free Guidance</span>
            </div>
          </motion.div>

          {/* Right Column: Exploded 3D Isometric Architecture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-6 flex items-center justify-center lg:justify-end overflow-visible"
          >
            <IsometricIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
