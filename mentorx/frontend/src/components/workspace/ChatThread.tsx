"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Copy,
  Check,
  Sparkles,
  ArrowDown,
} from "lucide-react";
import { useChatStore, ChatMessage } from "@/store/useChatStore";
import MarkdownMessage from "./MarkdownMessage";

export default function ChatThread() {
  const { activeSessionId, sessions, isStreaming } = useChatStore();
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages || [];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const userScrolledUp = useRef(false);

  // Directly scroll the container down to follow incoming tokens
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: "end" });
    } else if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, []);

  // Auto-scroll on new messages and streaming tokens (unless user explicitly scrolled up)
  useEffect(() => {
    if (!userScrolledUp.current) {
      scrollToBottom(isStreaming ? "auto" : "smooth");
    }
  }, [messages, isStreaming, scrollToBottom]);

  // When a new user question is submitted, re-engage auto-scroll
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "user") {
      userScrolledUp.current = false;
      scrollToBottom("smooth");
    }
  }, [messages.length, scrollToBottom]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isNearBottom = distanceToBottom < 120;
    
    userScrolledUp.current = !isNearBottom;
    setShowScrollBottom(!isNearBottom);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-8 py-4 pb-48 custom-scrollbar select-text scroll-smooth"
    >
      <div className="w-full max-w-3xl mx-auto space-y-6">
        {messages.map((msg: ChatMessage) => (
          <div key={msg.id} className="w-full">
            {msg.role === "user" ? (
              /* ================= User Message Bubble ================= */
              <div className="flex justify-end items-end gap-2.5 my-3">
                <div className="max-w-[85%] sm:max-w-[75%] bg-[#f4f4f5] text-[#18181b] px-4 py-2.5 rounded-3xl rounded-br-md text-[14px] leading-relaxed font-normal shadow-2xs border border-[#e4e4e7]">
                  <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                </div>
              </div>
            ) : (
              /* ================= Assistant Response ================= */
              <div className="flex justify-start items-start gap-3.5 my-4">
                {/* MentorX Logo Avatar */}
                <div className="w-7 h-7 rounded-full bg-[#18181b] text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-xs ring-2 ring-white select-none">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>

                {/* Message Content Column */}
                <div className="flex-1 min-w-0 pr-2">
                  {/* Meta Header */}
                  <div className="flex items-center gap-2 mb-1.5 text-xs text-[#71717a] select-none">
                    <span className="font-bold text-[#18181b]">MentorX</span>
                    {msg.isDeepResearch && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#18181b] text-white">
                        Deep Research
                      </span>
                    )}
                    {msg.isWebSearch && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7]">
                        Web Search
                      </span>
                    )}
                    <span className="text-[10px] text-[#a1a1aa] ml-auto">
                      {msg.isStreaming ? "Synthesizing..." : msg.timestamp}
                    </span>
                  </div>

                  {/* Formatted Markdown Body / Initial Retrieval Indicator */}
                  {msg.isStreaming && !msg.content ? (
                    <div className="flex items-center gap-2 py-2 text-xs text-[#71717a]">
                      <span className="w-2 h-2 rounded-full bg-[#18181b] animate-ping" />
                      <span>Formulating admission guidance...</span>
                    </div>
                  ) : (
                    <div className="text-[#27272a] leading-relaxed">
                      <MarkdownMessage content={msg.content} isStreaming={msg.isStreaming} />
                    </div>
                  )}

                  {/* Action Bar (Copy Button) */}
                  {!msg.isStreaming && msg.content && (
                    <div className="mt-2.5 flex items-center gap-2 select-none">
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        title="Copy response"
                        className="p-1.5 rounded-lg text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors cursor-pointer text-xs flex items-center gap-1"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-[11px] text-green-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Bottom Scroll Anchor */}
        <div ref={messagesEndRef} className="h-4 w-full" />
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={() => {
            userScrolledUp.current = false;
            scrollToBottom("smooth");
          }}
          className="fixed bottom-28 right-8 p-2.5 rounded-full bg-white text-[#18181b] border border-[#e4e4e7] shadow-lg hover:bg-[#f4f4f5] transition-all cursor-pointer z-30 flex items-center justify-center"
          title="Scroll to bottom"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
