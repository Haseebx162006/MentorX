"use client";

import React, { useRef } from "react";
import {
  ArrowUp,
  Paperclip,
  Globe,
  Atom,
  X,
  FileText,
  Square,
  Sparkles,
} from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useUIStore } from "@/store/useUIStore";

interface PromptInputProps {
  className?: string;
}

export default function PromptInput({ className = "" }: PromptInputProps) {
  const {
    inputMessage,
    setInputMessage,
    sendMessage,
    isStreaming,
    stopStreaming,
    deepResearchEnabled,
    toggleDeepResearch,
    webSearchEnabled,
    toggleWebSearch,
    uploadedFiles,
    addUploadedFile,
    removeUploadedFile,
  } = useChatStore();

  const { setSavedPromptsModalOpen } = useUIStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isStreaming) return;
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      addUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || "application/pdf",
      });
    }
  };

  return (
    <div className={`w-full max-w-3xl mx-auto flex flex-col items-center ${className}`}>
      {/* ChatGPT-Style Elevated Input Box */}
      <div className="w-full bg-white rounded-[26px] border border-[#e4e4e7] shadow-xs p-3.5 transition-all focus-within:border-[#18181b] focus-within:shadow-md">
        {/* Uploaded Files Chips */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 pb-2 border-b border-[#f4f4f5]">
            {uploadedFiles.map((file, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#f4f4f5] border border-[#e4e4e7] text-xs text-[#18181b]"
              >
                <FileText className="w-3.5 h-3.5 text-[#71717a]" />
                <span className="truncate max-w-[160px] font-medium">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeUploadedFile(file.name)}
                  className="hover:text-red-600 cursor-pointer p-0.5 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Multi-line Expanding Input */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message MentorX..."
          className="w-full max-h-48 resize-none bg-transparent border-none outline-none text-[14px] text-[#18181b] placeholder-[#a1a1aa] leading-relaxed py-1 px-1 custom-scrollbar"
        />

        {/* Bottom Toolbar Row */}
        <div className="flex items-center justify-between mt-2 pt-1">
          {/* Left Action Controls */}
          <div className="flex items-center gap-1.5">
            {/* Attach File Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach document or syllabus"
              className="p-2 rounded-full text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Deep Research Toggle */}
            <button
              type="button"
              onClick={toggleDeepResearch}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                deepResearchEnabled
                  ? "bg-[#18181b] text-white shadow-xs"
                  : "bg-[#f4f4f5] text-[#52525b] hover:bg-[#e4e4e7] hover:text-[#18181b]"
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Deep Research</span>
            </button>

            {/* Web Search Toggle */}
            <button
              type="button"
              onClick={toggleWebSearch}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                webSearchEnabled
                  ? "bg-[#18181b] text-white shadow-xs"
                  : "bg-[#f4f4f5] text-[#52525b] hover:bg-[#e4e4e7] hover:text-[#18181b]"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web Search</span>
            </button>

            {/* Prompt Templates */}
            <button
              type="button"
              onClick={() => setSavedPromptsModalOpen(true)}
              title="Curated academic prompts"
              className="p-2 rounded-full text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

          {/* Right Circular Send / Stop Button */}
          <div>
            {isStreaming ? (
              <button
                type="button"
                onClick={stopStreaming}
                title="Stop generation"
                className="w-8 h-8 rounded-full bg-[#18181b] text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-[#3f3f46] transition-all hover:scale-105 active:scale-95"
              >
                <Square className="w-3 h-3 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!inputMessage.trim()}
                title="Send message"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  inputMessage.trim()
                    ? "bg-[#18181b] text-white hover:scale-105 active:scale-95 shadow-xs"
                    : "bg-[#f4f4f5] text-[#a1a1aa] cursor-not-allowed"
                }`}
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* ChatGPT-Style Bottom Disclaimer */}
      <p className="text-[11px] text-[#a1a1aa] mt-2 text-center select-none">
        MentorX can make mistakes. Check important admission criteria and aggregate formulas with official university prospectuses.
      </p>
    </div>
  );
}
