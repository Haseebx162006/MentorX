"use client";

import React from "react";
import { motion } from "framer-motion";

export default function GlowingOrb() {
  return (
    <div className="relative flex items-center justify-center my-3 select-none pointer-events-none">
      {/* Soft Ambient Radial Glow */}
      <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-[#18181b]/5 via-[#71717a]/5 to-transparent blur-xl" />

      {/* Main 3D Kinetic Gyroscopic Core */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Outer Orbit Track */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-[#d4d4d8]"
        >
          {/* Orbital Satellite Node */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#18181b] shadow-xs" />
        </motion.div>

        {/* Counter-Rotating Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-3 rounded-full border-[1.5px] border-[#a1a1aa]/60"
        >
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#71717a]" />
        </motion.div>

        {/* Floating 3D Prismatic Core */}
        <motion.div
          animate={{
            y: [-3, 3, -3],
            rotateZ: [0, 5, -5, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#18181b] via-[#27272a] to-[#09090b] shadow-[0_10px_25px_rgba(0,0,0,0.18)] p-[1.5px] flex items-center justify-center"
        >
          {/* Faceted Core Inset */}
          <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#ffffff] via-[#f4f4f5] to-[#e4e4e7] flex items-center justify-center p-2 shadow-inner">
            <div className="w-4 h-4 rounded-md bg-[#18181b] shadow-sm transform rotate-45" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
