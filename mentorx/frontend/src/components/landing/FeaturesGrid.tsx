"use client";

import React from "react";
import {
  Compass,
  Calculator,
  Award,
  BookMarked,
  ShieldCheck,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: Compass,
    title: "University Compatibility Matcher",
    description:
      "Enter your Matric, FSc Part 1/2 marks or A-Level grades to instantly view high, moderate, and safe match universities across Pakistan and abroad.",
  },
  {
    icon: Calculator,
    title: "Exact Aggregate Calculator",
    description:
      "Automated aggregate calculations for NUST NET, FAST Entry Test, GIKI, UET ECAT, MDCAT, COMSATS NTS-NAT, and IBA Karachi.",
  },
  {
    icon: BookMarked,
    title: "Closing Merit Cutoff Intelligence",
    description:
      "Access multi-year closing merit lists, series-by-series merit position rankings, and expected closing aggregate benchmarks for 2025-2026.",
  },
  {
    icon: Award,
    title: "Scholarship & Financial Aid Finder",
    description:
      "Discover 100% fully-funded need-based & merit scholarships including LUMS NOP, GIKI Financial Assistance, PEEF, and HEC Ehsaas.",
  },
  {
    icon: ShieldCheck,
    title: "HEC Policy & Stream Transition",
    description:
      "Step-by-step guidance for Pre-Medical students entering Computing/BSCS, Pre-Engineering students switching to Business/Fintech, and O/A-Level equivalence (IBCC).",
  },
  {
    icon: Zap,
    title: "Live Admissions Deadline Tracker",
    description:
      "Stay ahead with entry test registration dates, test cycle schedules (NET 1, 2, 3, 4), and document submission deadlines.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-16 bg-[#fafafa] border-b border-[#e4e4e7] select-none">
      <div className="w-full px-6 sm:px-10 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e4e4e7] text-[#52525b] text-xs font-mono mb-3 shadow-2xs">
            <span>⚡ Complete Admissions Toolkit</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18181b] tracking-tight">
            Everything You Need for Your Dream University Admission
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#71717a]">
            Empowering Pakistani and international students with reliable, data-backed guidance from intermediate exams to university enrollment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-white border border-[#e4e4e7] shadow-2xs hover:border-[#a1a1aa] hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#18181b] text-white flex items-center justify-center mb-4 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#18181b] mb-1.5">{feature.title}</h3>
                  <p className="text-xs text-[#71717a] leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
