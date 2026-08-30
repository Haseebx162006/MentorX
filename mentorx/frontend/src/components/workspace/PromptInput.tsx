"use client";

import React, { useRef, useState } from "react";
import {
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  Lightbulb,
  Cpu,
  Globe,
  Mic,
  Send,
  Atom,
  X,
  FileText,
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
  const [isRecording, setIsRecording] = useState(false);

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

  const toggleMic = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setInputMessage("Summarize the thermodynamic laws and their application in Carnot engine efficiency.");
    }
  };

  return (
    <div className={`w-full max-w-3xl mx-auto flex flex-col items-center ${className}`}>
      {/* Main Elevated Input Card */}
      <div className="w-full bg-white rounded-3xl border border-[#e4e4e7] shadow-sm p-3.5 sm:p-4 transition-all focus-within:border-[#18181b] focus-within:shadow-md">
        {/* Uploaded Files Chips */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 pb-2 border-b border-[#f4f4f5]">
            {uploadedFiles.map((file, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#f4f4f5] border border-[#e4e4e7] text-xs text-[#18181b]"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeUploadedFile(file.name)}
                  className="hover:text-[#71717a] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          rows={2}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          className="w-full resize-none bg-transparent border-none outline-none text-sm text-[#18181b] placeholder-[#a1a1aa] leading-relaxed"
        />

        {/* Inner Action Bar */}
        <div className="flex items-center justify-between mt-2.5 pt-2">
          {/* Left Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Deeper Research Pill Button */}
            <button
              type="button"
              onClick={toggleDeepResearch}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                deepResearchEnabled
                  ? "bg-[#18181b] text-white shadow-xs"
                  : "bg-[#f4f4f5] border border-[#e4e4e7] text-[#52525b] hover:bg-[#e4e4e7] hover:text-[#18181b]"
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Deeper Research</span>
            </button>

            {/* Media / Image Upload */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload image or diagram"
              className="p-1.5 rounded-lg text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {/* Prompt Ideas */}
            <button
              type="button"
              onClick={() => setSavedPromptsModalOpen(true)}
              title="Prompt ideas and shortcuts"
              className="p-1.5 rounded-lg text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Model / Chip Toggle */}
            <button
              type="button"
              title="Groq Llama 3.3 70B & Qdrant Engine"
              className="p-1.5 rounded-lg text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
            </button>

            {/* Web Search Toggle */}
            <button
              type="button"
              onClick={toggleWebSearch}
              title={webSearchEnabled ? "Web Search Active" : "Enable Web Search"}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                webSearchEnabled
                  ? "bg-[#18181b] text-white"
                  : "text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5]"
              }`}
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* Circular Send / Mic Button */}
            <button
              type="button"
              onClick={inputMessage.trim() ? () => handleSubmit() : toggleMic}
              disabled={isStreaming}
              className="w-8 h-8 rounded-full bg-[#18181b] text-white flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-[#e4e4e7]"
            >
              {inputMessage.trim() ? (
                <Send className="w-3.5 h-3.5" />
              ) : isRecording ? (
                <span className="w-2.5 h-2.5 rounded-sm bg-white animate-pulse" />
              ) : (
                <Mic className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-bar below Input Box */}
      <div className="w-full flex items-center justify-between px-2 mt-2 text-xs text-[#71717a]">
        {/* Saved Prompts */}
        <button
          type="button"
          onClick={() => setSavedPromptsModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-[#71717a] hover:text-[#18181b] transition-colors font-medium cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#18181b]" />
          <span>Saved prompts</span>
        </button>

        {/* Attach File */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e4e4e7] text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-all cursor-pointer shadow-2xs"
        >
          <Paperclip className="w-3.5 h-3.5" />
          <span>Attach file</span>
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
