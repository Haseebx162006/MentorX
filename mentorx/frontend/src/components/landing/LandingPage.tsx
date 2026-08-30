"use client";

import React from "react";
import LandingNavbar from "./LandingNavbar";
import HeroSection from "./HeroSection";
import SyllabusExplorer from "./SyllabusExplorer";
import RagComparisonSandbox from "./RagComparisonSandbox";
import FeaturesGrid from "./FeaturesGrid";
import TestimonialsSection from "./TestimonialsSection";
import { useUIStore } from "@/store/useUIStore";

export default function LandingPage() {
  const { openAuthModal, setCurrentView } = useUIStore();

  const faqs = [
    {
      q: "How does MentorX prevent AI hallucinations in science subjects?",
      a: "MentorX executes a strict LangGraph RAG pipeline. It retrieves official textbook chunks from Qdrant, decomposes them into single sentences, grades each sentence for relevance, and drops ungrounded statements before generating answers.",
    },
    {
      q: "Does it cover both FSc Board Examinations and Entry Tests?",
      a: "Yes! MentorX is trained on standard Punjab, Federal, and Provincial textbook curricula, plus past papers and conceptual reasoning requirements for MDCAT, ECAT, NUST NET, and FAST CS entry tests.",
    },
    {
      q: "Why is authentication only via Google?",
      a: "To eliminate friction and enhance security. With 1-click Google Sign-in, your notes, chat history, and personal study plan are securely synced across all your devices with zero passwords to remember.",
    },
    {
      q: "What is 'Deeper Research' mode?",
      a: "When toggled on, MentorX conducts multi-stage reasoning: searching multi-board textbooks, past papers, and university problem sets to provide comprehensive mathematical derivations and detailed step-by-step solutions.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#ededed] text-[#18181b] p-3 sm:p-6 md:p-10 flex flex-col items-center justify-center selection:bg-[#18181b] selection:text-white">
      {/* Outer Elevated Rounded Application Container (Matching Reference Image) */}
      <div className="w-full max-w-[1360px] bg-white rounded-[32px] border border-[#e4e4e7] shadow-xl overflow-hidden flex flex-col">
        {/* Navigation Bar inside the card */}
        <LandingNavbar />

        {/* Hero Section with Exploded 3D Isometric Illustration */}
        <HeroSection />

        {/* Interactive FSc Syllabus Roadmap */}
        <SyllabusExplorer />

        {/* Side-by-Side RAG Comparison Sandbox */}
        <RagComparisonSandbox />

        {/* Architectural Features Grid */}
        <div id="technology">
          <FeaturesGrid />
        </div>

        {/* Student Testimonials */}
        <TestimonialsSection />

        {/* FAQ Section */}
        <section id="faq" className="py-16 px-6 sm:px-12 bg-[#fafafa] border-t border-[#f4f4f5]">
          <div className="max-w-4xl mx-auto">
            <div className="text-left mb-10">
              <h2 className="text-2xl font-serif font-bold tracking-tight text-[#18181b]">
                Frequently Asked Questions
              </h2>
              <p className="mt-1 text-xs text-[#71717a]">
                Understanding the MentorX academic pipeline and methodology.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-[#e4e4e7] shadow-2xs"
                >
                  <h3 className="font-semibold text-xs text-[#18181b] mb-1.5">{faq.q}</h3>
                  <p className="text-xs text-[#71717a] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 px-8 bg-white border-t border-[#f4f4f5] text-xs text-[#71717a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <div className="w-2 h-4 bg-[#18181b] rounded-2xs transform -skew-x-12" />
              <div className="w-2 h-4 bg-[#71717a] rounded-2xs transform -skew-x-12" />
            </div>
            <span className="font-bold text-[#18181b]">MentorX AI</span>
            <span>• Academic Intelligence Platform</span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <button
              type="button"
              onClick={() => setCurrentView("workspace")}
              className="hover:text-[#18181b] cursor-pointer"
            >
              Interactive Workspace
            </button>
            <button
              type="button"
              onClick={() => openAuthModal("signin")}
              className="hover:text-[#18181b] cursor-pointer"
            >
              Sign in with Google
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
