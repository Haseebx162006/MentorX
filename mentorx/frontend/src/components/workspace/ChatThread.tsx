"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Copy,
  Check,
  BookOpen,
  Sparkles,
  ArrowDown,
  ExternalLink,
  Globe,
} from "lucide-react";
import { useChatStore, ChatMessage } from "@/store/useChatStore";
import MarkdownMessage from "./MarkdownMessage";

const cleanSourceSnippet = (raw: string) => {
  if (!raw) return "Verified academic information from university documents.";
  let clean = raw
    .replace(/^"?TITLE:[^\n]*\n?/i, "")
    .replace(/URL:[^\n]*\n?/i, "")
    .replace(/CONTENT:\s*/i, "")
    .replace(/^"|"$/g, "")
    .trim();
  clean = clean.replace(/\s+/g, " ");
  return clean || "Official admission guidelines & criteria.";
};

const extractDomain = (url?: string) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
};

export default function ChatThread() {
  const { activeSessionId, sessions } = useChatStore();
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages || [];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const isAutoScrollActive = useRef(true);

  // Directly scroll the container down to follow incoming tokens
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (behavior === "smooth") {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  // Follow stream output smoothly
  useEffect(() => {
    if (isAutoScrollActive.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceToBottom < 120;
    isAutoScrollActive.current = nearBottom;
    setShowScrollBottom(!nearBottom);
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
      className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-8 py-4 pb-44 custom-scrollbar select-text"
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
                      <span className="w-2 h-2 rounded-full bg-[#18181b] opacity-80" />
                      <span>Searching Qdrant vector database and formulating guidance...</span>
                    </div>
                  ) : (
                    <div className="text-[#27272a] leading-relaxed">
                      <MarkdownMessage content={msg.content} isStreaming={msg.isStreaming} />
                    </div>
                  )}

                  {/* Grounded Knowledge Sources (Cleaned & Formatted) */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#f4f4f5]">
                      <div className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono select-none">
                        <BookOpen className="w-3.5 h-3.5 text-[#18181b]" /> Verified Knowledge Sources:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.sources.map((src, i) => {
                          const domain = extractDomain(src.url);
                          const cleanSnippet = cleanSourceSnippet(src.snippet);

                          return (
                            <div
                              key={i}
                              className="p-3 rounded-xl bg-[#fafafa] border border-[#e4e4e7] hover:border-[#a1a1aa] transition-colors text-xs flex flex-col justify-between"
                            >
                              <div>
                                <div className="font-semibold text-[#18181b] truncate flex items-center justify-between gap-2">
                                  <span className="truncate" title={src.title}>{src.title}</span>
                                  <span className="text-[9px] font-mono uppercase bg-white px-1.5 py-0.5 rounded border border-[#e4e4e7] flex-shrink-0">
                                    {src.sourceType === "web" ? "WEB" : "PROSPECTUS"}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#71717a] line-clamp-2 mt-1.5 italic leading-snug">
                                  "{cleanSnippet}"
                                </p>
                              </div>

                              <div className="mt-2.5 pt-1.5 border-t border-[#f4f4f5] flex items-center justify-between">
                                {src.url ? (
                                  <a
                                    href={src.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-blue-600 font-semibold hover:underline flex items-center gap-1 truncate"
                                  >
                                    <Globe className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">{domain || "Visit Website"}</span>
                                    <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                                  </a>
                                ) : (
                                  <span className="text-[10px] text-[#71717a] font-medium font-mono">
                                    Local Vector Knowledge
                                  </span>
                                )}
                                {src.relevanceScore && (
                                  <span className="text-[10px] text-[#15803d] font-semibold flex-shrink-0">
                                    {Math.round(src.relevanceScore * 100)}% match
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
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
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={() => {
            isAutoScrollActive.current = true;
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
