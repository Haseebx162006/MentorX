import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MentorX • AI Academic Guidance for FSc & College Students",
  description:
    "An AI Academic and Career Guidance Assistant tailored for FSc students, powered by syllabus-grounded RAG, Groq LLMs, and Qdrant vector retrieval.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#f7f5fa] text-[#1c1926]">
        {children}
      </body>
    </html>
  );
}
