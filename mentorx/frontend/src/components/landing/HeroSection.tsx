"use client";

import React from "react";
import { motion } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import IsometricIllustration from "./IsometricIllustration";

export default function HeroSection() {
  const { openAuthModal, setCurrentView } = useUIStore();

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
            {/* Main Headline from Reference Image */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-medium tracking-tight text-[#18181b] leading-[1.12]">
              <span className="font-serif block text-[#18181b]">
                Safeguard your academic journey
              </span>
              <span className="block mt-1">
                with intelligent{" "}
                <span className="text-[#a1a1aa] italic font-serif font-normal">and</span>
              </span>
              <span className="text-[#a1a1aa] font-serif font-normal block mt-1">
                automated mentorship
              </span>
            </h1>

            {/* Subheading from Reference Image */}
            <p className="mt-6 text-xs sm:text-sm text-[#71717a] leading-relaxed max-w-md font-normal">
              Automate textbook breakdown, syllabus retrieval, and complex problem derivations without getting lost in fragmented video lectures.
            </p>

            {/* Action Buttons from Reference Image */}
            <div className="mt-9 flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => openAuthModal("signin")}
                className="px-7 py-3 rounded-full bg-[#18181b] text-white text-xs font-semibold hover:bg-[#27272a] active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                Request demo
              </button>

              <button
                type="button"
                onClick={() => setCurrentView("workspace")}
                className="px-7 py-3 rounded-full bg-white border border-[#e4e4e7] text-[#27272a] text-xs font-semibold hover:bg-[#fafafa] hover:border-[#d4d4d8] active:scale-95 transition-all shadow-2xs cursor-pointer"
              >
                Learn More
              </button>
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
