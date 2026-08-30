"use client";

import React from "react";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Zainab Fatima",
    role: "FSc Pre-Medical (912/1100)",
    admission: "Admitted to FAST Islamabad (BS Data Science)",
    quote:
      "When I decided not to pursue MBBS, I was confused if I could do BS Data Science without FSc Math. MentorX explained HEC's deficiency course policy, calculated my FAST aggregate, and guided me through the math test. I secured admission in the first merit list!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Hamza Tariq",
    role: "FSc Pre-Engineering (884/1100)",
    admission: "Admitted to NUST SEECS (BS Software Engineering)",
    quote:
      "MentorX gave me the exact NET score targets based on my 1st-year marks. Knowing I needed a 146+ in NET allowed me to focus on high-yield physics and calculus topics rather than guessing.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Ahmad Raza",
    role: "A-Levels (2A* 1A)",
    admission: "Admitted to GIKI & LUMS (Full Financial Aid)",
    quote:
      "As an A-Level student, converting grades to IBCC equivalence and applying for LUMS NOP felt overwhelming. MentorX provided the exact formula, deadline dates, and financial document checklist.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-white border-b border-[#e4e4e7] select-none">
      <div className="w-full px-6 sm:px-10 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4f4f5] border border-[#e4e4e7] text-[#52525b] text-xs font-mono mb-3 shadow-2xs">
            <span>🌟 Student Success Stories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18181b] tracking-tight">
            Helping Students Reach Top Universities
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#71717a]">
            Hear from students who navigated university admissions with personalized guidance from MentorX.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] flex flex-col justify-between hover:border-[#a1a1aa] transition-all shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-1 text-[#eab308] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#52525b] leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#e4e4e7]">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#e4e4e7]"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#18181b]">{t.name}</h4>
                  <div className="text-[10px] text-[#71717a]">{t.role}</div>
                  <div className="text-[10px] font-semibold text-[#18181b] mt-0.5">{t.admission}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
