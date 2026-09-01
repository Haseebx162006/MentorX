"use client";

import React, { useState } from "react";
import { Check, X, Sparkles, Building, AlertCircle } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";

interface ComparisonScenario {
  id: string;
  title: string;
  studentProfile: string;
  genericOutput: {
    answer: string;
    flaw: string;
  };
  mentorxOutput: {
    answer: string;
    advantage: string;
  };
}

const COMPARISON_SCENARIOS: ComparisonScenario[] = [
  {
    id: "nust-fast-cs",
    title: "FAST vs NUST Aggregate Calculation & Eligibility",
    studentProfile: "FSc Pre-Engineering: 865/1100 (78.6%) | Matric: 990/1100 (90.0%)",
    genericOutput: {
      answer: "FAST and NUST both take 50% FSc marks and 50% Entry test marks. If you score 70% in your test you can easily get CS.",
      flaw: "Incorrect aggregate formulas! NUST uses 75% NET + 15% FSc + 10% Matric. FAST uses 50% Test + 40% FSc + 10% Matric. Generic advice misleads students on test targets.",
    },
    mentorxOutput: {
      answer: "With 78.6% FSc and 90.0% Matric:\n• For FAST BSCS: Your academic score is 40.4%. You need an entry test score of 68+ (34%) to hit the ~74.5% safe closing cutoff.\n• For NUST SEECS: Your academic score contributes 20.8%. You will need 148+ in NET (75% weightage = 55.5%) to reach the ~76.3% aggregate threshold.",
      advantage: "100% verified official formula weightages with precise minimum test score targets for safe admission.",
    },
  },
  {
    id: "pre-med-cs",
    title: "FSc Pre-Medical Transition into Computing/BSCS",
    studentProfile: "FSc Pre-Medical: 940/1100 (85.4%) | No Math background in intermediate",
    genericOutput: {
      answer: "You cannot apply for Computer Science or Software Engineering with Pre-Medical in Pakistan because mathematics is compulsory.",
      flaw: "Outdated HEC rule knowledge! Since 2022, HEC and major universities (FAST, NUST, GIKI, ITU, COMSATS) permit Pre-Medical students to take BSCS with a deficiency math course.",
    },
    mentorxOutput: {
      answer: "You are fully eligible for BSCS, BSAI, and BS Software Engineering under HEC's revised policy.\n• Eligible Universities: FAST, NUST, GIKI, COMSATS, ITU, PIEAS, Air University.\n• Condition: You will take 2 deficiency mathematics credit courses (Pre-Calculus & Calculus) in your first 2 semesters.\n• Strategy: FAST requires you to take their basic math test, while NUST has a dedicated NET-Applied Sciences stream.",
      advantage: "Up-to-date HEC & university admission policy compliance, preventing students from missing eligible computing careers.",
    },
  },
  {
    id: "scholarships",
    title: "Low Budget & Need-Based Full Scholarships",
    studentProfile: "FSc ICS: 920/1100 (83.6%) | Family monthly income < PKR 60,000",
    genericOutput: {
      answer: "Look for general government scholarships or apply to public universities which have lower fees.",
      flaw: "Vague and unhelpful. Misses high-value opportunities like LUMS NOP, GIKI Financial Assistance, and PEEF / Ehsaas HEC scholarships.",
    },
    mentorxOutput: {
      answer: "Target these top fully-funded financial aid programs:\n1. LUMS NOP (National Outreach Program): Covers 100% tuition, hostel & stipend.\n2. FAST Financial Aid / PEEF Scholarship: Up to 100% fee waiver for top 10% merit or low-income students.\n3. HEC Ehsaas / USAID Need-Based: Covers complete tuition + monthly living stipend across all public universities (COMSATS, UET, NUST).\n4. Application Deadlines & Document Checklist: Income certificate, utility bills, FSc transcript.",
      advantage: "Actionable financial aid roadmap with specific scholarship programs and deadline tracking.",
    },
  },
];

export default function RagComparisonSandbox() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>("nust-fast-cs");
  const { setCurrentView, openAuthModal } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const { sendMessage } = useChatStore();

  const scenario = COMPARISON_SCENARIOS.find((s) => s.id === activeScenarioId) || COMPARISON_SCENARIOS[0];

  const handleTestInChat = () => {
    if (!isAuthenticated) {
      openAuthModal("signin");
    } else {
      setCurrentView("workspace");
      sendMessage(`Analyze my university compatibility: ${scenario.studentProfile}`);
    }
  };

  return (
    <section className="py-16 bg-white border-b border-[#e4e4e7] select-none">
      <div className="w-full px-6 sm:px-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4f4f5] border border-[#e4e4e7] text-[#52525b] text-xs font-mono mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#18181b]" />
            <span>Why MentorX vs Generic AI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18181b] tracking-tight">
            Accurate Admission Intelligence vs Misleading General Advice
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#71717a]">
            Generic LLMs hallucinate outdated Pakistani university policies and wrong aggregate weightages. MentorX is grounded in verified university prospectuses and HEC policies.
          </p>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {COMPARISON_SCENARIOS.map((sc) => {
            const isActive = sc.id === activeScenarioId;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => setActiveScenarioId(sc.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#18181b] text-white shadow-xs"
                    : "bg-[#fafafa] text-[#52525b] border border-[#e4e4e7] hover:bg-[#f4f4f5] hover:text-[#18181b]"
                }`}
              >
                {sc.title}
              </button>
            );
          })}
        </div>

        {/* Student Profile Card */}
        <div className="p-4 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] shadow-2xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#71717a] uppercase">Simulated Student Profile</span>
            <div className="text-sm font-bold text-[#18181b] mt-0.5">{scenario.studentProfile}</div>
          </div>
          <button
            type="button"
            onClick={handleTestInChat}
            className="px-4 py-2 rounded-xl bg-[#18181b] text-white text-xs font-semibold hover:bg-[#27272a] transition-all cursor-pointer flex-shrink-0"
          >
            Test with Your Own Marks →
          </button>
        </div>

        {/* Side-by-side Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Generic AI Column */}
          <div className="p-5 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-[#fee2e2] text-[#dc2626] flex items-center justify-center font-bold text-xs">
                  <X className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-[#71717a]">Generic AI Chatbots</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#e4e4e7] text-xs text-[#52525b] whitespace-pre-line leading-relaxed mb-4">
                {scenario.genericOutput.answer}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#fff1f2] border border-[#fecdd3] text-xs text-[#9f1239] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#e11d48]" />
              <div>
                <span className="font-bold">The Flaw: </span>
                {scenario.genericOutput.flaw}
              </div>
            </div>
          </div>

          {/* MentorX Column */}
          <div className="p-5 rounded-2xl bg-[#fafafa] border-2 border-[#18181b] flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-[#18181b] text-white flex items-center justify-center font-bold text-xs">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-[#18181b]">MentorX Admissions Intelligence</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#e4e4e7] text-xs text-[#18181b] font-medium whitespace-pre-line leading-relaxed mb-4">
                {scenario.mentorxOutput.answer}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] text-xs text-[#166534] flex items-start gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#15803d]" />
              <div>
                <span className="font-bold">MentorX Grounding: </span>
                {scenario.mentorxOutput.advantage}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
