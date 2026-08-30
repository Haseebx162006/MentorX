"use client";

import React from "react";
import { Clock, Lightbulb, Scale } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";

export default function StarterCards() {
  const { setInputMessage } = useChatStore();

  const cards = [
    {
      icon: <Clock className="w-3.5 h-3.5 text-[#18181b]" />,
      title: "Synthesize Data",
      description: "Turn my meeting notes into 5 key bullet points for the team.",
      query: "Turn my meeting notes into 5 key bullet points for the team.",
    },
    {
      icon: <Lightbulb className="w-3.5 h-3.5 text-[#18181b]" />,
      title: "Creative Brainstorm",
      description: "Generate 3 taglines for a new sustainable fashion brand.",
      query: "Generate 3 taglines for a new sustainable fashion brand.",
    },
    {
      icon: <Scale className="w-3.5 h-3.5 text-[#18181b]" />,
      title: "Check Facts",
      description: "Compare key differences between GDPR and CCPA.",
      query: "Compare key differences between GDPR and CCPA.",
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
