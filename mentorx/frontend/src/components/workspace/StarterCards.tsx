"use client";

import React from "react";
import { Compass, Calculator, TrendingUp } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";

export default function StarterCards() {
  const { setInputMessage } = useChatStore();

  const cards = [
    {
      icon: <Compass className="w-3.5 h-3.5 text-[#18181b]" />,
      title: "University Matcher",
      description: "I scored 85% in FSc Pre-Medical. What are my best options for BSCS, Biotech, and Allied Health Sciences?",
      query: "I scored 85% in FSc Pre-Medical and 90% in Matric. Recommend the best compatible universities in Pakistan for Computing (BSCS/AI), Biotechnology, and Allied Health with their expected eligibility cutoffs.",
    },
    {
      icon: <Calculator className="w-3.5 h-3.5 text-[#18181b]" />,
      title: "Aggregate Calculator",
      description: "Calculate my exact NUST NET aggregate with 88% Matric, 82% FSc Part 1, and target NET 145.",
      query: "Calculate my exact NUST NET aggregate and FAST aggregate if I have 88% in Matric, 82% in FSc Part 1, and score 145 in NET.",
    },
    {
      icon: <TrendingUp className="w-3.5 h-3.5 text-[#18181b]" />,
      title: "Closing Merit Cutoffs",
      description: "What were the 2024-2025 closing merit percentages for FAST Islamabad BSCS and SE?",
      query: "What were the previous year closing merit percentages and merit lists for FAST Islamabad, NUST SEECS, and GIKI for Computer Science and Software Engineering?",
    },
  ];

  const handleCardClick = (query: string) => {
    setInputMessage(query);
  };

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
      {cards.map((card, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleCardClick(card.query)}
          className="p-3.5 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] text-left hover:border-[#18181b] hover:bg-white hover:shadow-xs transition-all duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center mb-2 group-hover:bg-[#f4f4f5] transition-colors border border-[#e4e4e7]">
              {card.icon}
            </div>
            <h4 className="font-semibold text-xs text-[#18181b] mb-0.5">{card.title}</h4>
            <p className="text-[10px] text-[#71717a] leading-relaxed line-clamp-2">
              {card.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
