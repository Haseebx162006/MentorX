"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Calculator,
  Compass,
  ArrowRight,
  TrendingUp,
  Percent,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useChatStore } from "@/store/useChatStore";

interface UniversityTrack {
  id: string;
  name: string;
  badge: string;
  icon: string;
  description: string;
  institutes: {
    name: string;
    location: string;
    aggregateFormula: string;
    closingMeritEstimate: string;
    topPrograms: string[];
    samplePrompt: string;
  }[];
}

const UNIVERSITY_TRACKS: UniversityTrack[] = [
  {
    id: "computing",
    name: "Computing & Software",
    badge: "BSCS / BSSE / BSAI / Data Science",
    icon: "💻",
    description: "Tailored admission pathways for FSc Pre-Engineering, ICS & A-Level Math students.",
    institutes: [
      {
        name: "FAST-NUCES (ISB / LHR / KHI)",
        location: "Islamabad, Lahore, Karachi",
        aggregateFormula: "50% Entry Test + 40% FSc + 10% Matric",
        closingMeritEstimate: "~73.5% - 78.2% (BSCS / BSSE)",
        topPrograms: ["Computer Science", "Software Engineering", "Artificial Intelligence", "Cyber Security"],
        samplePrompt: "I scored 880/1100 in FSc and 950 in Matric. What are my chances for FAST Islamabad BSCS and what entry test score do I need?",
      },
      {
        name: "NUST (SEECS)",
        location: "H-12, Islamabad",
        aggregateFormula: "75% NET + 15% FSc + 10% Matric",
        closingMeritEstimate: "~78.5% - 81.0% (NET Score: 145+)",
        topPrograms: ["BS Computer Science", "BS Software Engineering", "BS Artificial Intelligence"],
        samplePrompt: "Calculate my exact NUST aggregate if I have 84% in FSc Part 1, 91% in Matric, and need admission in NUST SEECS.",
      },
      {
        name: "GIKI (Top Institute of Technology)",
        location: "Topi, Khyber Pakhtunkhwa",
        aggregateFormula: "85% GIKI Entry Test + 15% FSc Part 1",
        closingMeritEstimate: "Merit Rank ~1 - 450 for CS/AI",
        topPrograms: ["Computer Science", "Artificial Intelligence", "Data Science"],
        samplePrompt: "What is the fee structure and scholarship criteria at GIKI for high-achieving FSc Pre-Engineering students?",
      },
      {
        name: "COMSATS University",
        location: "Islamabad, Lahore, Abbottabad",
        aggregateFormula: "50% NTS NAT-IE/ICS + 40% FSc + 10% Matric",
        closingMeritEstimate: "~84.5% - 87.0% (Islamabad Campus)",
        topPrograms: ["BS Computer Science", "BS Software Engineering", "BS Cyber Security"],
        samplePrompt: "What NAT-IE score do I need for COMSATS Islamabad CS if my FSc marks are 820/1100?",
      },
    ],
  },
  {
    id: "medical",
    name: "Medical & Dental",
    badge: "MBBS / BDS / DPT / Pharm-D",
    icon: "🩺",
    description: "Guidance for FSc Pre-Medical and A-Level Biology students seeking medical colleges.",
    institutes: [
      {
        name: "King Edward Medical University (KEMU)",
        location: "Lahore, Punjab",
        aggregateFormula: "50% MDCAT + 40% FSc Pre-Med + 10% Matric",
        closingMeritEstimate: "~93.6% - 94.2% (Open Merit Punjab)",
        topPrograms: ["MBBS (King Edward)", "Allied Health Sciences"],
        samplePrompt: "My FSc Pre-Med marks are 1010/1100 and Matric is 1050/1100. What MDCAT score guarantees a seat in King Edward Medical University?",
      },
      {
        name: "Aga Khan University (AKU)",
        location: "Karachi, Sindh",
        aggregateFormula: "AKU Test + Multiple Mini Interviews (MMI) + FSc/A-Levels",
        closingMeritEstimate: "Holistic Evaluation & AKU Test Screening",
        topPrograms: ["MBBS", "BSc Nursing", "Biomedical Sciences"],
        samplePrompt: "What is the admission procedure, AKU test syllabus, and financial assistance policy at Aga Khan University for MBBS?",
      },
      {
        name: "Allama Iqbal Medical College (AIMC)",
        location: "Lahore, Punjab",
        aggregateFormula: "50% MDCAT + 40% FSc + 10% Matric (UHS Centralized)",
        closingMeritEstimate: "~92.8% - 93.4%",
        topPrograms: ["MBBS", "Physiotherapy"],
        samplePrompt: "If I don't secure MBBS open merit, what are top alternative medical fields like DPT, Pharm-D, or Medical Lab Tech with good career scope in Pakistan?",
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering & Technology",
    badge: "Electrical / Mechanical / Civil / Aerospace",
    icon: "⚙️",
    description: "Eligibility cutoffs and aggregate calculation for PEC-accredited engineering programs.",
    institutes: [
      {
        name: "UET Lahore",
        location: "Lahore, Punjab",
        aggregateFormula: "33% ECAT + 50% FSc Pre-Eng + 17% Matric",
        closingMeritEstimate: "~74.0% - 82.5% (Electrical / Mechanical)",
        topPrograms: ["Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Mechatronics"],
        samplePrompt: "How does UET Lahore calculate ECAT aggregate and what was the 2024 closing merit for Mechatronics & Control Engineering?",
      },
      {
        name: "NUST (SMME / SCME / NICE)",
        location: "Islamabad",
        aggregateFormula: "75% NET + 15% FSc + 10% Matric",
        closingMeritEstimate: "~68.0% - 74.5% (NET Score: 120-138)",
        topPrograms: ["Mechanical Engineering", "Aerospace Engineering", "Chemical Engineering"],
        samplePrompt: "What NET score is required for Aerospace Engineering at NUST CAE or Mechanical at SMME with 78% in FSc?",
      },
    ],
  },
  {
    id: "business",
    name: "Business, Econ & Social Sciences",
    badge: "BBA / BS ACF / Economics / Fintech",
    icon: "📈",
    description: "Admissions guidance for IBA, LUMS, NUST NBS, and prestigious business schools.",
    institutes: [
      {
        name: "LUMS (Lahore University of Management Sciences)",
        location: "Lahore",
        aggregateFormula: "SAT-1 / LCAT + Matric/O-Levels + FSc/A-Levels + Personal Statement",
        closingMeritEstimate: "SAT 1350+ (SDSB Business) / SAT 1420+ (SSE Science)",
        topPrograms: ["BS Accounting & Finance", "BBA / Management Sciences", "BS Economics"],
        samplePrompt: "I am an FSc student with 85% marks. What SAT score and extracurricular profile do I need for 100% NOP scholarship at LUMS?",
      },
      {
        name: "IBA Karachi",
        location: "Karachi",
        aggregateFormula: "IBA Aptitude Test (Math + English) + Interview",
        closingMeritEstimate: "Direct Admission Cutoff: SAT 1400+ or IBA Test Direct Pass",
        topPrograms: ["BBA", "BS Accounting & Finance", "BS Economics & Mathematics"],
        samplePrompt: "What is the direct admission exemption criteria at IBA Karachi via SAT-1 and how can an FSc student prepare for the IBA Aptitude Test?",
      },
    ],
  },
];

export default function SyllabusExplorer() {
  const [selectedTrackId, setSelectedTrackId] = useState<string>("computing");
  const { setCurrentView } = useUIStore();
  const { sendMessage } = useChatStore();

  const currentTrack = UNIVERSITY_TRACKS.find((t) => t.id === selectedTrackId) || UNIVERSITY_TRACKS[0];

  const handleAskMentor = (prompt: string) => {
    setCurrentView("workspace");
    sendMessage(prompt);
  };

  return (
    <section className="py-16 bg-[#fafafa] border-y border-[#e4e4e7] relative select-none">
      <div className="w-full px-6 sm:px-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e4e4e7] text-[#52525b] text-xs font-mono mb-3 shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-[#18181b]" />
            <span>Interactive University & Merit Compass</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18181b] tracking-tight">
            Find Your Compatible University & Closing Merits
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#71717a]">
            Explore aggregate formulas, required entry test scores, and historical closing merit lists across top institutions in Pakistan.
          </p>
        </div>

        {/* Track Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {UNIVERSITY_TRACKS.map((track) => {
            const isActive = track.id === selectedTrackId;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => setSelectedTrackId(track.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#18181b] text-white shadow-xs"
                    : "bg-white text-[#52525b] border border-[#e4e4e7] hover:bg-[#f4f4f5] hover:text-[#18181b]"
                }`}
              >
                <span>{track.icon}</span>
                <span>{track.name}</span>
              </button>
            );
          })}
        </div>

        {/* Track Details Banner */}
        <div className="p-4 rounded-2xl bg-white border border-[#e4e4e7] shadow-2xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-[#18181b] flex items-center gap-2">
              <span>{currentTrack.icon}</span>
              <span>{currentTrack.name} Admission Pathways</span>
              <span className="text-[10px] font-mono bg-[#f4f4f5] text-[#52525b] px-2 py-0.5 rounded-full border border-[#e4e4e7]">
                {currentTrack.badge}
              </span>
            </div>
            <p className="text-xs text-[#71717a] mt-1">{currentTrack.description}</p>
          </div>

          <button
            type="button"
            onClick={() => handleAskMentor(`I have completed FSc in ${currentTrack.name}. Help me compare all top universities and calculate my expected closing merit.`)}
            className="px-4 py-2 rounded-xl bg-[#18181b] text-white text-xs font-semibold hover:bg-[#27272a] transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer shadow-2xs"
          >
            <span>Ask Mentor About This Field</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* University Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentTrack.institutes.map((inst, idx) => (
            <motion.div
              key={inst.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="p-5 rounded-2xl bg-white border border-[#e4e4e7] shadow-2xs hover:border-[#a1a1aa] hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div>
                    <h3 className="text-sm font-bold text-[#18181b]">{inst.name}</h3>
                    <span className="text-[11px] text-[#71717a]">{inst.location}</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#f4f4f5] text-[#27272a] border border-[#e4e4e7]">
                    Est. Merit: {inst.closingMeritEstimate}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="p-2 rounded-xl bg-[#fafafa] border border-[#f4f4f5]">
                    <div className="text-[10px] font-mono font-bold text-[#71717a] uppercase mb-0.5">
                      Aggregate Criteria Formula
                    </div>
                    <div className="text-xs font-semibold text-[#18181b]">{inst.aggregateFormula}</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono font-bold text-[#71717a] uppercase mb-1">
                      Key Programs
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {inst.topPrograms.map((prog) => (
                        <span
                          key={prog}
                          className="px-2 py-0.5 rounded-md bg-[#f4f4f5] text-[10px] text-[#52525b] font-medium"
                        >
                          {prog}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAskMentor(inst.samplePrompt)}
                className="w-full py-2 px-3 rounded-xl bg-[#f4f4f5] hover:bg-[#18181b] text-[#27272a] hover:text-white text-xs font-semibold transition-all flex items-center justify-between cursor-pointer group mt-2"
              >
                <span className="truncate text-left max-w-[85%]">{inst.samplePrompt}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
