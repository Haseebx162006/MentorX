"use client";

import React from "react";
import { motion } from "framer-motion";

export default function IsometricIllustration() {
  return (
    <div className="relative w-full max-w-[660px] h-[520px] sm:h-[580px] flex items-center justify-center select-none overflow-visible">
      {/* Complete High-Fidelity Isometric Vector Engine */}
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 760 640"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* =========================================================================
            1. ISOMETRIC 30-DEGREE BACKGROUND GRID
           ========================================================================= */}
        <defs>
          <pattern id="ref-iso-grid" width="80" height="46.188" patternUnits="userSpaceOnUse">
            <path
              d="M 80 0 L 0 46.188 M 0 0 L 80 46.188"
              stroke="#e4e4e7"
              strokeWidth="0.8"
              strokeDasharray="2 3"
            />
          </pattern>
        </defs>
        <rect x="0" y="0" width="760" height="640" fill="url(#ref-iso-grid)" opacity="0.75" />

        {/* =========================================================================
            2. THIN CONNECTING CIRCUIT LINES & NODES
           ========================================================================= */}
        <g stroke="#71717a" strokeWidth="1.2" fill="none">
          {/* Top-Left Server to Center Line */}
          <path d="M 235 240 L 290 270 L 320 252" />
          <circle cx="235" cy="240" r="2.5" fill="#18181b" stroke="#18181b" />

          {/* Left Data Card Line */}
          <path d="M 270 330 L 310 355 L 345 335" strokeDasharray="3 3" />
          <circle cx="270" cy="330" r="2.5" fill="#18181b" stroke="#18181b" />

          {/* Bottom-Left Barcode to Rig Line */}
          <path d="M 310 430 L 360 400 L 380 412" />
          <circle cx="310" cy="430" r="2.5" fill="#18181b" stroke="#18181b" />

          {/* Rig to Top-Right Note Card */}
          <path d="M 490 280 L 530 255 L 565 275" />
          <circle cx="565" cy="275" r="2.5" fill="#18181b" stroke="#18181b" />

          {/* Top-Right Circular Target Node */}
          <circle cx="545" cy="235" r="4.5" fill="none" stroke="#18181b" strokeWidth="1.2" />
          <circle cx="545" cy="235" r="1.5" fill="#18181b" />
          <path d="M 545 240 L 545 250 L 530 255" />

          {/* Right Circuit Path to Browser Window */}
          <path d="M 565 340 L 600 360 L 570 378" strokeDasharray="3 3" />
          <circle cx="600" cy="360" r="2.5" fill="#18181b" stroke="#18181b" />
        </g>


        {/* =========================================================================
            3. TOP-LEFT: 3D STACKED SERVER TOWER (Qdrant Vector DB & Syllabus Embeddings)
           ========================================================================= */}
        <motion.g
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Server Block 1 (Top) */}
          <path d="M 225 155 L 260 135 L 295 155 L 260 175 Z" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M 225 155 L 225 175 L 260 195 L 260 175 Z" fill="#e4e4e7" stroke="#18181b" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M 260 195 L 295 175 L 295 155 L 260 175 Z" fill="#d4d4d8" stroke="#18181b" strokeWidth="1.5" strokeLinejoin="round" />

          {/* Server Block 2 */}
          <path d="M 225 175 L 225 195 L 260 215 L 260 195 Z" fill="#e4e4e7" stroke="#18181b" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M 260 215 L 295 195 L 295 175 L 260 195 Z" fill="#d4d4d8" stroke="#18181b" strokeWidth="1.5" strokeLinejoin="round" />

          {/* Server Block 3 */}
          <path d="M 225 195 L 225 215 L 260 235 L 260 215 Z" fill="#e4e4e7" stroke="#18181b" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M 260 235 L 295 215 L 295 195 L 260 215 Z" fill="#d4d4d8" stroke="#18181b" strokeWidth="1.5" strokeLinejoin="round" />

          {/* Server Block 4 (Bottom) */}
          <path d="M 225 215 L 225 235 L 260 255 L 260 235 Z" fill="#e4e4e7" stroke="#18181b" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M 260 255 L 295 235 L 295 215 L 260 235 Z" fill="#d4d4d8" stroke="#18181b" strokeWidth="1.5" strokeLinejoin="round" />

          {/* Server Blade Horizontal Slots */}
          <line x1="235" y1="172" x2="252" y2="182" stroke="#71717a" strokeWidth="1.2" />
          <line x1="235" y1="192" x2="252" y2="202" stroke="#71717a" strokeWidth="1.2" />
          <line x1="235" y1="212" x2="252" y2="222" stroke="#71717a" strokeWidth="1.2" />
          <line x1="235" y1="232" x2="252" y2="242" stroke="#71717a" strokeWidth="1.2" />
        </motion.g>


        {/* =========================================================================
            4. MID-LEFT: FLOATING DATA CHIP CARD
           ========================================================================= */}
        <motion.g
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Card Base */}
          <path d="M 175 285 L 235 250 L 270 270 L 210 305 Z" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Solid Circle */}
          <circle cx="198" cy="283" r="6.5" fill="#18181b" />
          {/* Square Chips */}
          <path d="M 220 262 L 234 254 L 244 260 L 230 268 Z" fill="#18181b" />
          <path d="M 212 284 L 226 276 L 236 282 L 222 290 Z" fill="#18181b" />
          {/* Micro Lines */}
          <line x1="242" y1="264" x2="256" y2="256" stroke="#18181b" strokeWidth="1.5" />
          <line x1="245" y1="270" x2="259" y2="262" stroke="#18181b" strokeWidth="1.5" />
          <line x1="248" y1="276" x2="262" y2="268" stroke="#18181b" strokeWidth="1.5" />
        </motion.g>


        {/* =========================================================================
            5. BOTTOM-LEFT: BARCODE & TELEMETRY SHEET
           ========================================================================= */}
        <motion.g
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        >
          {/* Sheet Surface */}
          <path d="M 180 395 L 270 340 L 335 378 L 245 433 Z" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Barcode Group */}
          <line x1="205" y1="388" x2="225" y2="376" stroke="#18181b" strokeWidth="2.5" />
          <line x1="213" y1="395" x2="233" y2="383" stroke="#18181b" strokeWidth="1" />
          <line x1="220" y1="399" x2="240" y2="387" stroke="#18181b" strokeWidth="3" />
          <line x1="230" y1="405" x2="250" y2="393" stroke="#18181b" strokeWidth="1" />
          <line x1="238" y1="410" x2="258" y2="398" stroke="#18181b" strokeWidth="2.5" />
          <line x1="248" y1="416" x2="268" y2="404" stroke="#18181b" strokeWidth="1.5" />
          <line x1="256" y1="421" x2="276" y2="409" stroke="#18181b" strokeWidth="3.5" />

          {/* Long Diagonal Divider */}
          <line x1="255" y1="375" x2="295" y2="398" stroke="#18181b" strokeWidth="1" />

          {/* Checkboxes Row */}
          <rect x="202" y="396" width="8" height="6" transform="skewY(-30)" fill="#ffffff" stroke="#18181b" strokeWidth="1" />
          <rect x="216" y="404" width="8" height="6" transform="skewY(-30)" fill="#ffffff" stroke="#18181b" strokeWidth="1" />
          <rect x="230" y="412" width="8" height="6" transform="skewY(-30)" fill="#18181b" stroke="#18181b" strokeWidth="1" />
          <rect x="244" y="420" width="8" height="6" transform="skewY(-30)" fill="#ffffff" stroke="#18181b" strokeWidth="1" />
        </motion.g>


        {/* =========================================================================
            6. TOP-RIGHT: FLOATING NOTE SHEET
           ========================================================================= */}
        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M 505 270 L 555 240 L 585 258 L 535 288 Z" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Note Text Lines */}
          <line x1="520" y1="268" x2="548" y2="251" stroke="#71717a" strokeWidth="1.5" />
          <line x1="524" y1="274" x2="552" y2="257" stroke="#71717a" strokeWidth="1.5" />
          <line x1="528" y1="280" x2="556" y2="263" stroke="#71717a" strokeWidth="1.5" />
        </motion.g>


        {/* =========================================================================
            7. CENTRAL EXPLODED 3D RIG (3 TIERS CONNECTED BY CORNER STANDOFFS)
           ========================================================================= */}

        {/* 4 Vertical Standoff Screws / Threaded Rods */}
        <line x1="295" y1="250" x2="295" y2="380" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="475" y1="250" x2="475" y2="380" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="385" y1="200" x2="385" y2="330" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="385" y1="305" x2="385" y2="435" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="3 3" />


        {/* --- TIER 1: SOLID CHASSIS BASE (Bottom Layer) --- */}
        <motion.g
          animate={{ y: [0, 2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Base Top Face */}
          <path d="M 295 350 L 385 298 L 475 350 L 385 402 Z" fill="#e4e4e7" stroke="#18181b" strokeWidth="2" strokeLinejoin="round" />
          {/* Base Left Face */}
          <path d="M 295 350 L 385 402 L 385 422 L 295 370 Z" fill="#27272a" stroke="#18181b" strokeWidth="2" strokeLinejoin="round" />
          {/* Base Right Face */}
          <path d="M 385 402 L 475 350 L 475 370 L 385 422 Z" fill="#18181b" stroke="#18181b" strokeWidth="2" strokeLinejoin="round" />

          {/* Corner Screw Washers on Base */}
          <circle cx="310" cy="355" r="3" fill="#ffffff" stroke="#18181b" strokeWidth="1" />
          <circle cx="460" cy="355" r="3" fill="#ffffff" stroke="#18181b" strokeWidth="1" />
          <circle cx="385" cy="312" r="3" fill="#ffffff" stroke="#18181b" strokeWidth="1" />
          <circle cx="385" cy="392" r="3" fill="#ffffff" stroke="#18181b" strokeWidth="1" />
        </motion.g>


        {/* --- TIER 2: PRINTED CIRCUIT BOARD WITH GEARS ⚙️ (Middle Layer) --- */}
        <motion.g
          animate={{ y: [-12, -20, -12] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* PCB Top Face */}
          <path d="M 295 305 L 385 253 L 475 305 L 385 357 Z" fill="#ffffff" stroke="#18181b" strokeWidth="2" strokeLinejoin="round" />
          {/* PCB Left Edge */}
          <path d="M 295 305 L 385 357 L 385 364 L 295 312 Z" fill="#d4d4d8" stroke="#18181b" strokeWidth="1.5" strokeLinejoin="round" />
          {/* PCB Right Edge */}
          <path d="M 385 357 L 475 305 L 475 312 L 385 364 Z" fill="#a1a1aa" stroke="#18181b" strokeWidth="1.5" strokeLinejoin="round" />

          {/* Microchip & Bus Lines on Left */}
          <path d="M 315 298 L 335 286 L 350 295 L 330 307 Z" fill="#e4e4e7" stroke="#18181b" strokeWidth="1.2" />
          <line x1="335" y1="286" x2="335" y2="278" stroke="#18181b" strokeWidth="1.2" />
          <line x1="340" y1="289" x2="340" y2="281" stroke="#18181b" strokeWidth="1.2" />
          <line x1="345" y1="292" x2="345" y2="284" stroke="#18181b" strokeWidth="1.2" />

          {/* Interlocking Gears ⚙️ (Exact to Reference Screenshot) */}
          {/* Large Lower Gear */}
          <g transform="translate(370, 325) skewY(-30) rotate(15)">
            <circle cx="0" cy="0" r="16" fill="#ffffff" stroke="#18181b" strokeWidth="2" strokeDasharray="3.5 3.5" />
            <circle cx="0" cy="0" r="6" fill="#18181b" />
          </g>
          {/* Small Upper Interlocking Gear */}
          <g transform="translate(398, 305) skewY(-30) rotate(-20)">
            <circle cx="0" cy="0" r="11" fill="#ffffff" stroke="#18181b" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="0" cy="0" r="4" fill="#18181b" />
          </g>

          {/* Turbine / Radial Cooling Fan on Right */}
          <g transform="translate(425, 290)">
            <rect x="-14" y="-8" width="28" height="16" transform="skewY(-30)" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="6" fill="#18181b" />
            {/* Radial Fan Vanes */}
            <line x1="-5" y1="-5" x2="5" y2="5" stroke="#ffffff" strokeWidth="1" />
            <line x1="5" y1="-5" x2="-5" y2="5" stroke="#ffffff" strokeWidth="1" />
          </g>

          {/* Three Port Cylinders on PCB Edge */}
          <circle cx="410" cy="335" r="2.5" fill="#18181b" />
          <circle cx="420" cy="330" r="2.5" fill="#18181b" />
          <circle cx="430" cy="325" r="2.5" fill="#18181b" />
        </motion.g>


        {/* --- TIER 3: TOP DARK FACEPLATE WITH CUTOUTS & FLOATING KEY (Top Layer) --- */}
        <motion.g
          animate={{ y: [-28, -40, -28] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Top Plate with Cutouts */}
          <path
            d="M 295 240 L 350 208 L 350 230 L 385 250 L 385 188 L 475 240 L 385 292 Z"
            fill="#18181b"
            stroke="#18181b"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Plate Rim Depths */}
          <path d="M 295 240 L 385 292 L 385 300 L 295 248 Z" fill="#27272a" stroke="#18181b" strokeWidth="1.5" />
          <path d="M 385 292 L 475 240 L 475 248 L 385 300 Z" fill="#09090b" stroke="#18181b" strokeWidth="1.5" />

          {/* Left Window Cutout */}
          <path d="M 320 240 L 340 228 L 355 237 L 335 249 Z" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" />

          {/* Center Circular Hole */}
          <ellipse cx="385" cy="225" rx="14" ry="8" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" />

          {/* Floating Solid Puck / Heatsink Cap above Circular Cutout */}
          <motion.g
            animate={{ y: [-6, -14, -6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ellipse cx="385" cy="180" rx="14" ry="8" fill="#27272a" stroke="#18181b" strokeWidth="1.5" />
            <path d="M 371 180 L 371 192 A 14 8 0 0 0 399 192 L 399 180 Z" fill="#18181b" stroke="#18181b" strokeWidth="1.5" />
          </motion.g>

          {/* Right Bracket Cutout & Floating Key Component */}
          <path d="M 410 230 L 435 215 L 450 224 L 425 239 Z" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" />
          <motion.g
            animate={{ y: [-8, -16, -8] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M 435 200 L 460 185 L 475 194 L 450 209 Z" fill="#18181b" stroke="#18181b" strokeWidth="1.5" />
          </motion.g>
        </motion.g>


        {/* =========================================================================
            8. BOTTOM-RIGHT: LAYERED ISOMETRIC BROWSER WINDOW & ACADEMIC DOCUMENT
           ========================================================================= */}
        <motion.g
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
        >
          {/* Underlay Window Shadow Sheet */}
          <path d="M 345 425 L 460 360 L 580 428 L 465 493 Z" fill="#e4e4e7" stroke="#18181b" strokeWidth="1.5" />

          {/* Main Browser Window Header (Dark Bar with Window Controls) */}
          <path d="M 360 415 L 475 350 L 595 418 L 480 483 Z" fill="#ffffff" stroke="#18181b" strokeWidth="2" strokeLinejoin="round" />
          {/* Dark Top Title Bar */}
          <path d="M 360 415 L 475 350 L 490 358 L 375 423 Z" fill="#18181b" stroke="#18181b" strokeWidth="1.5" />
          {/* Three Window Control Dots (● ● ●) */}
          <circle cx="372" cy="416" r="2" fill="#ffffff" />
          <circle cx="380" cy="411" r="2" fill="#ffffff" />
          <circle cx="388" cy="406" r="2" fill="#ffffff" />

          {/* Document Content on Window: */}
          {/* Paragraph Lines on Left */}
          <line x1="390" y1="435" x2="435" y2="410" stroke="#18181b" strokeWidth="2" />
          <line x1="395" y1="446" x2="440" y2="421" stroke="#71717a" strokeWidth="1.5" />
          <line x1="400" y1="457" x2="445" y2="432" stroke="#71717a" strokeWidth="1.5" />
          <line x1="405" y1="468" x2="450" y2="443" stroke="#71717a" strokeWidth="1.5" />

          {/* Academic Analysis Icon (Clean diagram curve / without letter 'A') */}
          <path
            d="M 435 450 Q 455 425 470 440 T 495 415"
            stroke="#18181b"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Pie Chart 📊 on Document */}
          <g transform="translate(485, 455) skewY(-30)">
            <circle cx="0" cy="0" r="14" fill="#18181b" />
            <path d="M 0 0 L 14 0 A 14 14 0 0 1 -10 10 Z" fill="#ffffff" stroke="#18181b" strokeWidth="1" />
          </g>

          {/* Checklist / Score Matrix Table on Right */}
          <g transform="translate(485, 380)">
            {/* Grid Box */}
            <path d="M 0 0 L 45 -25 L 75 -8 L 30 17 Z" fill="#ffffff" stroke="#18181b" strokeWidth="1.2" />
            <line x1="15" y1="-8" x2="45" y2="9" stroke="#e4e4e7" strokeWidth="1" />
            <line x1="30" y1="-17" x2="60" y2="0" stroke="#e4e4e7" strokeWidth="1" />
            {/* Checkmark Badges (✓ ✓) */}
            <path d="M 12 -4 L 16 0 L 24 -8" stroke="#18181b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 22 4 L 26 8 L 34 0" stroke="#18181b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Mouse Cursor Pointer 👆 Pointing at Matrix */}
          <path
            d="M 525 430 L 538 418 L 542 428 L 550 426 L 545 415 L 555 416 Z"
            fill="#ffffff"
            stroke="#18181b"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </motion.g>
      </svg>
    </div>
  );
}
