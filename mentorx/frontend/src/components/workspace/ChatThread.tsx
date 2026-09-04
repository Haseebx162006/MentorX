"use client";

import React, { useRef, useEffect, useLayoutEffect, useState, useCallback } from "react";
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
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const userScrolledUp = useRef(false);

  // Directly anchor the container to the bottom
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    if (scrollContainerRef.current) {
      if (behavior === "smooth") {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      } else {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }
  }, []);

  // 1. Instant pinning on every streamed token update before screen paint
  useLayoutEffect(() => {
    if (!userScrolledUp.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  // 2. ResizeObserver to catch any layout growth (tables, code blocks, math)
  useEffect(() => {
    const el = contentWrapperRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      if (!userScrolledUp.current && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 3. When a new question is submitted or streaming begins, always re-engage auto-scroll
  useEffect(() => {
    if (isStreaming || (messages.length > 0 && messages[messages.length - 1].role === "user")) {
      userScrolledUp.current = false;
      setShowScrollBottom(false);
      scrollToBottom("auto");
    }
  }, [isStreaming, messages.length, scrollToBottom]);

  // 4. Detect intentional user wheel scrolls
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY < -4) {
      // User is deliberately scrolling UP
      userScrolledUp.current = true;
      setShowScrollBottom(true);
    } else if (e.deltaY > 4) {
      // User is scrolling DOWN - check if reached bottom
      const el = scrollContainerRef.current;
      if (el) {
        const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        if (distanceToBottom < 80) {
          userScrolledUp.current = false;
          setShowScrollBottom(false);
        }
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    
    if (distanceToBottom < 80) {
      userScrolledUp.current = false;
      setShowScrollBottom(false);
    } else if (!isStreaming && distanceToBottom > 200) {
      setShowScrollBottom(true);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      ref={scrollContainerRef}
      onWheel={handleWheel}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-8 py-4 pb-48 custom-scrollbar select-text"
    >
      <div ref={contentWrapperRef} className="w-full max-w-3xl mx-auto space-y-6">
        {messages.map((msg: ChatMessage) => (
          <div key={msg.id} className="w-full">
            {msg.role === "user" ? (
              /* ================= Claude-Style User Message ================= */
              <div className="flex justify-end items-end gap-2.5 my-4">
                <div className="group relative max-w-[85%] sm:max-w-[75%] bg-[#f4f4f5] text-[#18181b] px-4 py-3 rounded-2xl text-[15px] leading-relaxed font-normal shadow-2xs border border-[#e4e4e7]/70">
                  <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                </div>
              </div>
            ) : (
              /* ================= Claude-Style Assistant Response ================= */
              <div className="flex justify-start items-start gap-3.5 my-6">
                {/* MentorX Emblem Avatar */}
                <div className="w-7 h-7 rounded-lg bg-[#18181b] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs select-none">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>

                {/* Message Content Column */}
                <div className="flex-1 min-w-0 pr-2">
                  {/* Meta Header */}
                  <div className="flex items-center gap-2 mb-2 select-none">
                    <span className="font-semibold text-sm text-[#18181b]">MentorX</span>
                    <span className="text-[11px] text-[#a1a1aa]">
                      {msg.isStreaming ? "Formulating response..." : msg.timestamp}
                    </span>
                  </div>

                  {/* Formatted Markdown Body / Initial Retrieval Indicator */}
                  {msg.isStreaming && !msg.content ? (
                    <div className="flex items-center gap-2 py-3 text-xs text-[#71717a]">
                      <span className="w-2 h-2 rounded-full bg-[#18181b] animate-ping" />
                      <span>Retrieving verified prospectus chunks...</span>
                    </div>
                  ) : (
                    <div className="text-[#18181b] text-[15px] leading-relaxed">
                      <MarkdownMessage content={msg.content} isStreaming={msg.isStreaming} />
                    </div>
                  )}

                  {/* Claude-Style Action Bar (Docked neatly below message) */}
                  {!msg.isStreaming && msg.content && (
                    <div className="mt-3 flex items-center gap-1 select-none text-[#71717a]">
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        title="Copy response"
                        className="px-2 py-1 rounded-md text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-[11px] text-emerald-600 font-medium">Copied</span>
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
