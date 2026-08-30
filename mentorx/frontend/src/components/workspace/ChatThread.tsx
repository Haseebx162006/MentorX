"use client";

import React, { useRef, useEffect } from "react";
import {
  User,
  Copy,
  Check,
  BookOpen,
  Globe,
  Atom,
} from "lucide-react";
import { useChatStore, ChatMessage } from "@/store/useChatStore";

export default function ChatThread() {
  const { activeSessionId, sessions, isStreaming, streamingResponse } = useChatStore();
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages || [];
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingResponse]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-6 pt-2">
      {messages.map((msg: ChatMessage) => (
        <div key={msg.id} className="w-full">
          {msg.role === "user" ? (
            /* User Message Bubble */
            <div className="flex justify-end items-start gap-3">
              <div className="max-w-xl bg-[#18181b] text-white p-4 rounded-3xl rounded-tr-sm shadow-xs text-sm leading-relaxed">
                {msg.content}
              </div>
              <div className="w-8 h-8 rounded-full bg-[#27272a] text-white flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                <User className="w-4 h-4" />
              </div>
            </div>
          ) : (
            /* Assistant Message Card */
            <div className="flex justify-start items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#18181b] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <div className="flex items-center gap-0.5">
                  <div className="w-1 h-3 bg-white rounded-2xs transform -skew-x-12" />
                  <div className="w-1 h-3 bg-[#a1a1aa] rounded-2xs transform -skew-x-12" />
                </div>
              </div>

              <div className="flex-1 max-w-2xl bg-white border border-[#e4e4e7] p-5 rounded-3xl rounded-tl-sm shadow-xs">
                {/* Meta badges */}
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#f4f4f5]">
                  <span className="text-[11px] font-bold text-[#18181b] font-mono">
                    MentorX RAG
                  </span>
                  {msg.isDeepResearch && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#18181b] text-white">
                      <Atom className="w-3 h-3" /> Deep Research Active
                    </span>
                  )}
                  {msg.isWebSearch && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f4f4f5] text-[#18181b] border border-[#e4e4e7]">
                      <Globe className="w-3 h-3" /> Web Sources
                    </span>
                  )}
                  <span className="text-[10px] text-[#a1a1aa] ml-auto">{msg.timestamp}</span>
                </div>

                {/* Content */}
                <div className="text-sm text-[#18181b] leading-relaxed whitespace-pre-line space-y-2">
                  {msg.content}
                </div>

                {/* Grounded Sources Pill List */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#f4f4f5]">
                    <div className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                      <BookOpen className="w-3 h-3 text-[#18181b]" /> Verified Textbook Citations:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.sources.map((src, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-[#fafafa] border border-[#e4e4e7] text-xs flex flex-col justify-between"
                        >
                          <div className="font-semibold text-[#18181b] truncate">{src.title}</div>
                          <p className="text-[11px] text-[#71717a] line-clamp-2 mt-1 italic">
                            "{src.snippet}"
                          </p>
                          {src.relevanceScore && (
                            <div className="mt-1.5 flex items-center justify-between text-[10px]">
                              <span className="text-[#18181b] font-semibold uppercase font-mono">
                                {src.sourceType}
                              </span>
                              <span className="text-[#15803d] font-bold">
                                {Math.round(src.relevanceScore * 100)}% match
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="mt-3.5 pt-2 border-t border-[#f4f4f5] flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="p-1.5 rounded-lg text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors cursor-pointer text-xs flex items-center gap-1"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Streaming Response Indicator */}
      {isStreaming && (
        <div className="flex justify-start items-start gap-3.5">
          <div className="w-8 h-8 rounded-full bg-[#18181b] text-white flex items-center justify-center flex-shrink-0 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-white animate-ping" />
          </div>
          <div className="flex-1 max-w-2xl bg-white border border-[#e4e4e7] p-5 rounded-3xl rounded-tl-sm shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold text-[#18181b] font-mono">
                MentorX Synthesizing...
              </span>
              <span className="w-2 h-2 rounded-full bg-[#18181b] animate-ping" />
            </div>
            <div className="text-sm text-[#18181b] leading-relaxed whitespace-pre-line">
              {streamingResponse || "Consulting Qdrant vector knowledge and formulating response..."}
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
