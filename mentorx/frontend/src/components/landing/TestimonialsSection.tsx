"use client";

import React from "react";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const reviews = [
    {
      name: "Ayesha Malik",
      score: "MDCAT Score: 188/200",
      stream: "KEMU Admit 2025",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
      quote:
        "MentorX saved me hundreds of hours. Instead of re-reading whole chapters, it pinpointed exact textbook lines and explained tricky chemistry reaction mechanisms instantly.",
    },
    {
      name: "Hamza Tariq",
      score: "ECAT Top 1% • NUST NET: 162",
      stream: "NUST SEECS",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      quote:
        "The Deeper Research mode is unbelievable for Physics. It doesn't just give answers; it shows the full dimensional analysis and steps following our board criteria.",
    },
    {
      name: "Zainab Fatima",
      score: "FSc Board: 1045/1100",
      stream: "Federal Board",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
      quote:
        "Clean, calming design that doesn't distract me with flashy ads. It feels like having a senior professor available 24/7 on my desk.",
    },
  ];

  return (
    <section className="py-16 px-6 sm:px-12 bg-white border-t border-[#f4f4f5]">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-12 max-w-xl">
          <div className="text-[11px] font-mono font-bold text-[#71717a] uppercase tracking-wider mb-2">
            STUDENT PERFORMANCE
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#18181b]">
            Trusted by top-ranking intermediate students
          </h2>
          <p className="mt-2 text-xs text-[#71717a]">
            Documented outcomes from students preparing for Board & Entry Exams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-4 text-[#18181b]">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#3f3f46] leading-relaxed italic font-serif">
                  "{r.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#e4e4e7] flex items-center gap-3">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#d4d4d8]"
                />
                <div>
                  <div className="font-bold text-xs text-[#18181b]">{r.name}</div>
                  <div className="text-[11px] text-[#52525b] font-medium">{r.score}</div>
                  <div className="text-[10px] text-[#a1a1aa]">{r.stream}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
