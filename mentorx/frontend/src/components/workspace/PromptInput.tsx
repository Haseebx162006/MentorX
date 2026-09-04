"use client";

import React, { useRef, useEffect } from "react";
import { ArrowUp, Square } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";

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
  } = useChatStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height smoothly as user types like Claude
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
    }
  }, [inputMessage]);

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

  return (
    <div className={`w-full max-w-3xl mx-auto flex flex-col items-center ${className}`}>
      {/* Claude-Style Elevated Input Box */}
      <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-[#e4e4e7] shadow-xs hover:border-[#d4d4d8] focus-within:border-[#18181b] focus-within:shadow-md transition-all p-3.5 sm:p-4 relative">
        {/* Multi-line Expanding Input */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Reply to MentorX..."
          className="w-full min-h-[44px] max-h-56 resize-none bg-transparent border-none outline-none text-[15px] text-[#18181b] placeholder-[#a1a1aa] leading-relaxed py-1 px-1 custom-scrollbar font-normal"
        />

        {/* Minimal Bottom Toolbar Row */}
        <div className="flex items-center justify-between mt-1 pt-1">
          {/* Subtle Model / Context Indicator */}
          <div className="flex items-center gap-1.5 text-xs text-[#a1a1aa] select-none pl-1">
            <span className="text-[12px] text-[#a1a1aa] font-medium tracking-tight">MentorX Academic AI</span>
          </div>

          {/* Claude-Style Circular Send / Stop Button */}
          <div className="flex items-center">
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
                    ? "bg-[#18181b] text-white hover:bg-[#27272a] hover:scale-105 active:scale-95 shadow-xs"
                    : "bg-[#f4f4f5] text-[#a1a1aa] cursor-not-allowed"
                }`}
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Claude-Style Clean Bottom Disclaimer */}
      <p className="text-[11px] text-[#a1a1aa] mt-2 text-center select-none">
        MentorX can make mistakes. Check important admission criteria and aggregate formulas with official university prospectuses.
      </p>
    </div>
  );
}
