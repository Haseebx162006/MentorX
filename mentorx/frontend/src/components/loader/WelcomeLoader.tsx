"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Building2, Compass, Award } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

export default function WelcomeLoader() {
  const { finishLoader } = useUIStore();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Calibrating University Admissions Mentor...");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + 2;
        if (next === 30) setStatusText("Indexing Top Pakistani & Global University Prospectuses...");
        if (next === 65) setStatusText("Loading Historical Closing Merit Lists & Aggregate Criteria...");
        if (next === 90) setStatusText("Synthesizing Personalized Admission Matching Engine...");
        return next;
      });
    }, 38);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#ededed] flex items-center justify-center p-4 selection:bg-[#18181b] selection:text-white select-none">
      {/* Elevated White Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white rounded-[32px] border border-[#e4e4e7] p-8 shadow-xl flex flex-col items-center text-center overflow-hidden"
      >
        {/* Geometric Feathers Logo */}
        <div className="flex items-center gap-1 mb-4">
          <div className="w-2.5 h-6 bg-[#18181b] rounded-2xs transform -skew-x-12" />
          <div className="w-2.5 h-6 bg-[#71717a] rounded-2xs transform -skew-x-12" />
          <div className="w-2.5 h-6 bg-[#d4d4d8] rounded-2xs transform -skew-x-12" />
        </div>

        {/* Brand Header */}
        <h1 className="text-2xl font-serif font-bold text-[#18181b]">
          Mentor<span className="text-[#71717a]">X</span>
        </h1>
        <p className="mt-1 text-xs text-[#71717a] max-w-xs leading-relaxed">
          AI University Admission & Career Guidance Mentor for FSc and O/A-Level Students.
        </p>

        {/* Miniature Exploded 3D Isometric Core in Motion */}
        <div className="relative w-40 h-32 my-6 flex items-center justify-center">
          {/* Base Layer */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-2 w-28 h-14 rounded-xl bg-gradient-to-br from-[#f4f4f5] to-[#e4e4e7] border border-[#d4d4d8] shadow-sm"
            style={{ transform: "rotateX(60deg) rotateZ(-45deg)" }}
          />

          {/* Middle Gear Board */}
          <motion.div
            animate={{ y: [-6, -14, -6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-6 w-20 h-10 rounded-lg bg-white border border-[#18181b] shadow-sm flex items-center justify-center"
            style={{ transform: "rotateX(60deg) rotateZ(-45deg)" }}
          >
            <div className="w-4 h-4 rounded-full border border-dashed border-[#18181b] animate-spin-slow" />
          </motion.div>

          {/* Top Plate */}
          <motion.div
            animate={{ y: [-14, -24, -14] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1 w-12 h-12 rounded-lg bg-[#18181b] shadow-md flex items-center justify-center"
            style={{ transform: "rotateX(60deg) rotateZ(-45deg)" }}
          >
            <div className="w-4 h-4 rounded-full bg-white/20 animate-pulse" />
          </motion.div>
        </div>

        {/* Progress Bar & Status */}
        <div className="w-full mt-2">
          <div className="w-full h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden border border-[#e4e4e7]">
            <motion.div
              className="h-full bg-[#18181b] rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2.5 text-[11px] text-[#71717a]">
            <span className="font-medium truncate max-w-[240px] text-left">{statusText}</span>
            <span className="font-mono font-bold text-[#18181b]">{progress}%</span>
          </div>
        </div>

        {/* Action Button once ready */}
        <div className="mt-7 h-10 flex items-center justify-center">
          <AnimatePresence>
            {progress >= 100 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.92, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={finishLoader}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#18181b] text-white font-semibold text-xs shadow-md hover:bg-[#27272a] transition-all cursor-pointer"
              >
                <span>Find Compatible Universities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Trust Footnote */}
        <div className="mt-5 pt-3 border-t border-[#f4f4f5] flex items-center justify-center gap-4 text-[10px] text-[#a1a1aa]">
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3 text-[#18181b]" /> 50+ Top Universities
          </span>
          <span className="flex items-center gap-1">
            <Award className="w-3 h-3 text-[#18181b]" /> Verified Closing Merits
          </span>
        </div>
      </motion.div>
    </div>
  );
}
