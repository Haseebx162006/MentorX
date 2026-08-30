"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, Code2, Copy, Check, Compass } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useChatStore } from "@/store/useChatStore";

export default function ExportModal() {
  const { exportModalOpen, setExportModalOpen } = useUIStore();
  const { exportChat } = useChatStore();
  const [selectedFormat, setSelectedFormat] = useState<"markdown" | "json" | "txt">("markdown");
  const [copied, setCopied] = useState(false);

  if (!exportModalOpen) return null;

  const content = exportChat(selectedFormat);

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MentorX-chat-export.${selectedFormat === "markdown" ? "md" : selectedFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setExportModalOpen(false)}
          className="absolute inset-0 bg-[#1c1917]/45 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-7 shadow-2xl border border-[#e8dfd1]"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#f4ede2]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1c1917] text-[#fef3c7] flex items-center justify-center shadow-xs">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#1c1917]">Export Chat Session</h3>
                <p className="text-xs text-[#736c5f]">
                  Save your study notes and formulas locally.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setExportModalOpen(false)}
              className="p-1.5 rounded-lg text-[#857d70] hover:text-[#1c1917] hover:bg-[#f6eee2] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Format Selector */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { id: "markdown", label: "Markdown (.md)", icon: <FileText className="w-4 h-4" /> },
              { id: "json", label: "JSON (.json)", icon: <Code2 className="w-4 h-4" /> },
              { id: "txt", label: "Plain Text (.txt)", icon: <FileText className="w-4 h-4" /> },
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setSelectedFormat(fmt.id as any)}
                className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  selectedFormat === fmt.id
                    ? "border-[#b45309] bg-[#fef3c7] text-[#78350f]"
                    : "border-[#e5dcd0] bg-white text-[#665f53] hover:bg-[#faf7f2]"
                }`}
              >
                {fmt.icon}
                <span>{fmt.label}</span>
              </button>
            ))}
          </div>

          {/* Preview Box */}
          <div className="mt-4 p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ebe2d4] text-[11px] font-mono text-[#423d35] max-h-44 overflow-y-auto whitespace-pre-wrap select-all">
            {content || "No messages in this chat session to export."}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl border border-[#ded5c5] bg-white text-xs font-semibold text-[#423c33] hover:bg-[#f6efe4] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Content"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-xl bg-[#1c1917] text-[#faf7f2] text-xs font-semibold hover:bg-[#2c2825] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
