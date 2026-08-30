"use client";

import React, { useState } from "react";
import { BookOpen, Sparkles, ArrowRight, CheckCircle2, ChevronRight, Atom, Flame, GraduationCap } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useChatStore } from "@/store/useChatStore";

export default function SyllabusExplorer() {
  const { setCurrentView } = useUIStore();
  const { setInputMessage } = useChatStore();

  const subjects = [
    {
      id: "physics",
      name: "FSc Physics",
      book: "Book I & II • Punjab & Federal Boards",
      examWeight: "MDCAT: 27% • ECAT: 33%",
      chapters: [
        {
          num: "Ch 11",
          title: "Heat & Thermodynamics",
          highYield: "Carnot Engine, 1st Law, Adiabatic expansion",
          prompt: "Explain the working principle of Carnot engine and write the efficiency formula for numericals.",
        },
        {
          num: "Ch 12",
          title: "Electrostatics",
          highYield: "Gauss's Law applications, Electric potential of point charge",
          prompt: "Derive the electric field intensity due to an infinite sheet of charge using Gauss's Law.",
        },
        {
          num: "Ch 14",
          title: "Electromagnetism",
          highYield: "Ampere's Law, Force on moving charge in magnetic field",
          prompt: "Explain magnetic force on a moving charge and right-hand palm rule for direction.",
        },
        {
          num: "Ch 19",
          title: "Dawn of Modern Physics",
          highYield: "Photoelectric Effect, Compton Effect, De-Broglie wavelength",
          prompt: "Explain Einstein's Photoelectric equation and threshold frequency with graph.",
        },
      ],
    },
    {
      id: "chemistry",
      name: "FSc Chemistry",
      book: "Book I & II • Organic & Physical Chemistry",
      examWeight: "MDCAT: 27% • ECAT: 33%",
      chapters: [
        {
          num: "Ch 12",
          title: "Aldehydes & Ketones",
          highYield: "Aldol Condensation, Cannizzaro Reaction, Haloform test",
          prompt: "Compare the mechanisms of base-catalyzed Aldol condensation and Cannizzaro reaction.",
        },
        {
          num: "Ch 8",
          title: "Chemical Equilibrium",
          highYield: "Le Chatelier's Principle, Kc, Kp, Buffer solutions",
          prompt: "How does change in temperature and pressure shift equilibrium according to Le Chatelier?",
        },
        {
          num: "Ch 9",
          title: "Aromatic Hydrocarbons",
          highYield: "Benzene resonance, Electrophilic substitution mechanisms",
          prompt: "Explain the mechanism of nitration and Friedel-Crafts alkylation of benzene.",
        },
      ],
    },
    {
      id: "biology",
      name: "FSc Biology",
      book: "Book I & II • Cellular & Genetics Module",
      examWeight: "MDCAT: 34% (68 MCQs)",
      chapters: [
        {
          num: "Ch 20",
          title: "Chromosomes & DNA",
          highYield: "DNA Replication enzymes, Transcription, Genetic code",
          prompt: "Explain the roles of Helicase, DNA Polymerase III, and Ligase during semi-conservative replication.",
        },
        {
          num: "Ch 17",
          title: "Nervous Coordination",
          highYield: "Action Potential propagation, Synaptic transmission",
          prompt: "Describe the ionic events during depolarization and repolarization of an axon membrane.",
        },
        {
          num: "Ch 11",
          title: "Bioenergetics",
          highYield: "Light reaction, Non-cyclic photophosphorylation, Glycolysis",
          prompt: "Detail the steps of non-cyclic electron flow in chloroplast thylakoid membrane.",
        },
      ],
    },
    {
      id: "math",
      name: "FSc Mathematics",
      book: "Book I & II • Calculus & Analytical Geometry",
      examWeight: "ECAT: 33% • FAST: 50 MCQs",
      chapters: [
        {
          num: "Ch 2",
          title: "Differentiation",
          highYield: "Chain Rule, Implicit differentiation, Maxima & Minima",
          prompt: "Find the critical points and determine local extrema for f(x) = 2x^3 - 9x^2 + 12x + 5.",
        },
        {
          num: "Ch 6",
          title: "Conic Sections",
          highYield: "Parabola, Ellipse eccentricity, Hyperbola asymptotes",
          prompt: "Find the focus, vertex, and equation of directrix for the parabola y^2 = 12x.",
        },
      ],
    },
  ];

  const [activeSubject, setActiveSubject] = useState(subjects[0]);

  const handleLaunchPrompt = (prompt: string) => {
    setInputMessage(prompt);
    setCurrentView("workspace");
  };

  return (
    <section id="curriculum" className="py-16 px-6 sm:px-12 bg-white border-t border-[#f4f4f5]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-[11px] font-mono font-bold text-[#71717a] uppercase tracking-wider mb-2">
              INTERACTIVE SYLLABUS ROADMAP
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#18181b]">
              Grounded across all provincial board textbooks
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#71717a]">
              Select a subject below to explore high-yield chapter modules and instant MentorX guidance.
            </p>
          </div>

          {/* Subject Tab Switcher */}
          <div className="flex flex-wrap gap-2 bg-[#f4f4f5] p-1.5 rounded-2xl border border-[#e4e4e7]">
            {subjects.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSubject(s)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeSubject.id === s.id
                    ? "bg-[#18181b] text-white shadow-xs"
                    : "text-[#71717a] hover:text-[#18181b]"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Subject Card */}
        <div className="bg-[#fafafa] rounded-3xl border border-[#e4e4e7] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#e4e4e7] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif font-bold text-[#18181b]">
                  {activeSubject.name}
                </h3>
                <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#e4e4e7] text-[#18181b]">
                  {activeSubject.book}
                </span>
              </div>
              <p className="text-xs text-[#71717a] mt-1">
                Official textbook RAG embeddings verified against examination board schemas.
              </p>
            </div>
            <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-white border border-[#e4e4e7] text-[#18181b] shadow-2xs">
              {activeSubject.examWeight}
            </div>
          </div>

          {/* Chapter Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSubject.chapters.map((ch, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#e4e4e7] hover:border-[#18181b] transition-all flex flex-col justify-between group shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#71717a] px-2 py-0.5 rounded bg-[#f4f4f5]">
                      {ch.num}
                    </span>
                    <span className="text-[10px] font-semibold text-[#15803d] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 100% Grounded
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#18181b] mb-1.5">{ch.title}</h4>
                  <p className="text-xs text-[#71717a] leading-relaxed mb-4">
                    <strong>Key Topics:</strong> {ch.highYield}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunchPrompt(ch.prompt)}
                  className="w-full py-2 px-3 rounded-xl bg-[#f4f4f5] hover:bg-[#18181b] hover:text-white text-[11px] font-semibold text-[#18181b] transition-all flex items-center justify-between cursor-pointer"
                >
                  <span className="truncate">Ask: "{ch.prompt.substring(0, 32)}..."</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 flex-shrink-0" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
