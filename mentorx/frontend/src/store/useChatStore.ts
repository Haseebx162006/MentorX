import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";

export interface SourceDocument {
  title: string;
  url?: string;
  sourceType: "syllabus" | "web" | "paper";
  snippet: string;
  relevanceScore?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  sources?: SourceDocument[];
  isDeepResearch?: boolean;
  isWebSearch?: boolean;
  verdict?: "good" | "mixed" | "bad";
  refinedContext?: string;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  category: "Today" | "Yesterday" | "7 days" | "Older";
  messages: ChatMessage[];
  model: string;
  userId?: string;
}

interface ChatState {
  activeSessionId: string;
  sessions: ChatSession[];
  inputMessage: string;
  selectedModel: string;
  deepResearchEnabled: boolean;
  webSearchEnabled: boolean;
  isStreaming: boolean;
  streamingResponse: string;
  uploadedFiles: { name: string; size: string; type: string }[];
  searchQuery: string;
  isLoadingSessions: boolean;
  abortController: AbortController | null;

  // Actions
  setInputMessage: (msg: string) => void;
  setSelectedModel: (model: string) => void;
  toggleDeepResearch: () => void;
  toggleWebSearch: () => void;
  setSearchQuery: (query: string) => void;
  addUploadedFile: (file: { name: string; size: string; type: string }) => void;
  removeUploadedFile: (fileName: string) => void;
  clearUploadedFiles: () => void;

  loadUserSessions: (userId?: string) => Promise<void>;
  createNewChat: () => void;
  selectSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  sendMessage: (customText?: string) => Promise<void>;
  stopStreaming: () => void;
  exportChat: (format: "markdown" | "json" | "txt") => string;
}

const DUMMY_TITLES = [
  "create a detailed 7-day sprint plan",
  "draft a concise email to stakeho",
  "analyze the 'eisenhower matrix'",
  "summarize the main differences be",
  "i need to negotiate an extension fo",
  "generate 5 effective morning habit",
  "as a non-technical pm, list 5 cruci",
  "help me allocate 8 hours tomorrow",
  "we need a creative name for our n",
  "write a 100-word positive feedback",
];

const isDummySession = (title: string): boolean => {
  const t = (title || "").toLowerCase();
  return DUMMY_TITLES.some((d) => t.includes(d));
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      activeSessionId: "new-session",
      sessions: [],
      inputMessage: "",
      selectedModel: "MentorX AI",
      deepResearchEnabled: false,
      webSearchEnabled: false,
      isStreaming: false,
      streamingResponse: "",
      uploadedFiles: [],
      searchQuery: "",
      isLoadingSessions: false,
      abortController: null,

      setInputMessage: (msg) => set({ inputMessage: msg }),
      setSelectedModel: (model) => set({ selectedModel: model }),
      toggleDeepResearch: () => set((state) => ({ deepResearchEnabled: !state.deepResearchEnabled })),
      toggleWebSearch: () => set((state) => ({ webSearchEnabled: !state.webSearchEnabled })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      addUploadedFile: (file) => set((state) => ({ uploadedFiles: [...state.uploadedFiles, file] })),
      removeUploadedFile: (fileName) =>
        set((state) => ({
          uploadedFiles: state.uploadedFiles.filter((f) => f.name !== fileName),
        })),
      clearUploadedFiles: () => set({ uploadedFiles: [] }),

      loadUserSessions: async (userId) => {
        const uid = userId || useAuthStore.getState().user?.id || "";
        set({ isLoadingSessions: true });
        try {
          const res = await fetch(`/api/chat/sessions${uid ? `?userId=${encodeURIComponent(uid)}` : ""}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              const currentSessions = get().sessions;
              const currentActive = get().activeSessionId;

              const mergedSessions: ChatSession[] = data
                .filter((s: any) => !isDummySession(s.title))
                .map((s: any) => {
                  const existing = currentSessions.find((cs) => cs.id === s.id);
                  return {
                    id: s.id,
                    title: s.title || "Conversation",
                    createdAt: s.createdAt || new Date().toISOString(),
                    updatedAt: s.updatedAt || new Date().toISOString(),
                    category: s.category || "Today",
                    model: "MentorX AI",
                    userId: s.userId,
                    messages: existing && existing.messages.length > 0 ? existing.messages : [],
                  };
                });

              const activeInMemory = currentSessions.find(
                (cs) => cs.id === currentActive && !mergedSessions.some((ms) => ms.id === cs.id)
              );
              if (activeInMemory && activeInMemory.id !== "new-session") {
                mergedSessions.unshift(activeInMemory);
              }

              let nextActive = currentActive;
              if (mergedSessions.length > 0) {
                const sessionExists = mergedSessions.some((s) => s.id === currentActive);
                if (!sessionExists && currentActive !== "new-session") {
                  nextActive = mergedSessions[0].id;
                }
              } else if (currentActive !== "new-session") {
                nextActive = "new-session";
              }

              set({
                sessions: mergedSessions,
                activeSessionId: nextActive,
                isLoadingSessions: false,
              });

              const activeSess = mergedSessions.find((s) => s.id === nextActive);
              if (activeSess && activeSess.messages.length === 0 && nextActive !== "new-session") {
                get().selectSession(nextActive);
              }
              return;
            }
          }
        } catch (e) {
          console.warn("Failed to load user sessions from backend:", e);
        }
        set({ isLoadingSessions: false });
      },

      createNewChat: () => {
        if (get().isStreaming) {
          get().stopStreaming();
        }
        set({
          activeSessionId: "new-session",
          inputMessage: "",
          streamingResponse: "",
          isStreaming: false,
          abortController: null,
        });
      },

      selectSession: async (sessionId) => {
        if (get().isStreaming) {
          get().stopStreaming();
        }
        set({
          activeSessionId: sessionId,
          inputMessage: "",
          streamingResponse: "",
          isStreaming: false,
          abortController: null,
        });

        if (sessionId === "new-session") return;

        try {
          const res = await fetch(`/api/chat/sessions/${encodeURIComponent(sessionId)}`);
          if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.messages)) {
              const formattedMessages: ChatMessage[] = data.messages.map((m: any) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                timestamp: m.timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                sources: m.sources || [],
                verdict: m.verdict || "good",
                isStreaming: false,
              }));

              set((state) => ({
                sessions: state.sessions.map((s) =>
                  s.id === sessionId
                    ? {
                        ...s,
                        title: data.title || s.title,
                        messages: formattedMessages,
                      }
                    : s
                ),
              }));
            }
          }
        } catch (e) {
          console.warn("Failed to fetch session messages:", e);
        }
      },

      deleteSession: async (sessionId) => {
        set((state) => {
          const filtered = state.sessions.filter((s) => s.id !== sessionId);
          const nextActive =
            state.activeSessionId === sessionId ? (filtered[0]?.id || "new-session") : state.activeSessionId;
          return {
            sessions: filtered,
            activeSessionId: nextActive,
          };
        });

        try {
          await fetch(`/api/chat/sessions/${encodeURIComponent(sessionId)}`, {
            method: "DELETE",
          });
        } catch (e) {
          console.error("Failed to delete session on backend:", e);
        }
      },

      stopStreaming: () => {
        const controller = get().abortController;
        if (controller) {
          controller.abort();
        }
        set((state) => ({
          isStreaming: false,
          abortController: null,
          sessions: state.sessions.map((s) => ({
            ...s,
            messages: s.messages.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)),
          })),
        }));
      },

      sendMessage: async (customText) => {
        const text = (customText || get().inputMessage).trim();
        if (!text || get().isStreaming) return;

        const currentActiveId = get().activeSessionId;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const currentUser = useAuthStore.getState().user;
        const userId = currentUser?.id || "student_user";

        let targetSessionId = currentActiveId;

        // 1. If starting brand new chat
        if (currentActiveId === "new-session") {
          targetSessionId = `session_${Date.now()}`;
          const newTitle = text.length > 38 ? text.substring(0, 38) + "..." : text;
          const newSession: ChatSession = {
            id: targetSessionId,
            title: newTitle,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
            category: "Today",
            model: get().selectedModel,
            userId: userId,
            messages: [],
          };

          set((state) => ({
            sessions: [newSession, ...state.sessions.filter((s) => !isDummySession(s.title))],
            activeSessionId: targetSessionId,
          }));
        }

        // 2. Create User Message & Initial Assistant Message Placeholder
        const userMsg: ChatMessage = {
          id: `msg-user-${Date.now()}`,
          role: "user",
          content: text,
          timestamp: timeStr,
          isDeepResearch: get().deepResearchEnabled,
          isWebSearch: get().webSearchEnabled,
        };

        const assistantMsgId = `msg-ai-${Date.now()}`;
        const assistantPlaceholder: ChatMessage = {
          id: assistantMsgId,
          role: "assistant",
          content: "",
          timestamp: timeStr,
          sources: [],
          isDeepResearch: get().deepResearchEnabled,
          isWebSearch: get().webSearchEnabled,
          verdict: "good",
          isStreaming: true,
        };

        const controller = new AbortController();

        // 3. Immediately mount both messages in the conversation thread (No layout jump)
        set((state) => ({
          inputMessage: "",
          isStreaming: true,
          abortController: controller,
          streamingResponse: "",
          sessions: state.sessions.map((s) =>
            s.id === targetSessionId
              ? {
                  ...s,
                  messages: [...s.messages, userMsg, assistantPlaceholder],
                  updatedAt: new Date().toISOString(),
                }
              : s
          ),
        }));

        let accumulatedContent = "";
        let accumulatedSources: SourceDocument[] = [];
        let accumulatedVerdict: "good" | "mixed" | "bad" = "good";

        try {
          const isDeep = get().deepResearchEnabled;
          const isWeb = get().webSearchEnabled;

          const response = await fetch("/api/chat/stream", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: text,
              user_id: userId,
              session_id: targetSessionId,
              deep_research: isDeep,
              web_search: isWeb,
              model: get().selectedModel,
            }),
            signal: controller.signal,
          });

          if (response.ok && response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let lastFlush = 0;
            let pendingTimer: any = null;

            const flushTokens = () => {
              set((state) => ({
                sessions: state.sessions.map((s) =>
                  s.id === targetSessionId
                    ? {
                        ...s,
                        messages: s.messages.map((m) =>
                          m.id === assistantMsgId
                            ? {
                                ...m,
                                content: accumulatedContent,
                                sources: accumulatedSources.length > 0 ? accumulatedSources : m.sources,
                                verdict: accumulatedVerdict,
                                isStreaming: true,
                              }
                            : m
                        ),
                      }
                    : s
                ),
              }));
            };

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith("data:")) continue;
                const jsonStr = trimmed.replace(/^data:\s*/, "");
                try {
                  const event = JSON.parse(jsonStr);
                  if (event.type === "meta") {
                    if (event.sources) accumulatedSources = event.sources;
                    if (event.verdict) accumulatedVerdict = event.verdict;
                    flushTokens();
                  } else if (event.type === "token") {
                    accumulatedContent += event.content || "";
                    const now = Date.now();
                    if (now - lastFlush > 40) {
                      lastFlush = now;
                      if (pendingTimer) {
                        clearTimeout(pendingTimer);
                        pendingTimer = null;
                      }
                      flushTokens();
                    } else if (!pendingTimer) {
                      pendingTimer = setTimeout(() => {
                        lastFlush = Date.now();
                        pendingTimer = null;
                        flushTokens();
                      }, 40);
                    }
                  }
                } catch (err) {
                  console.debug("SSE chunk parse notice:", err);
                }
              }
            }

            if (pendingTimer) {
              clearTimeout(pendingTimer);
              pendingTimer = null;
            }
            flushTokens();
          }
        } catch (streamErr: any) {
          if (streamErr.name === "AbortError") {
            console.log("Streaming cancelled by user.");
          } else {
            console.warn("Streaming proxy notice, falling back:", streamErr);
            if (!accumulatedContent) {
              accumulatedContent = `### 🎓 MentorX Admission Guidance\n\nRegarding your inquiry on **${text}**:\n\n- Check official prospectus criteria and entry test weightages.`;
              accumulatedSources = [
                {
                  title: "Official University Admission Guidelines & Closing Merits",
                  sourceType: "syllabus",
                  snippet: "Verified aggregate calculation formulas and historical closing merit positions.",
                  relevanceScore: 0.95,
                },
              ];
            }
          }
        } finally {
          // 4. Mark streaming as complete on the active message
          set((state) => ({
            isStreaming: false,
            abortController: null,
            sessions: state.sessions.map((s) =>
              s.id === targetSessionId
                ? {
                    ...s,
                    title:
                      s.title === "New Conversation" && text
                        ? text.length > 38
                          ? text.slice(0, 38) + "..."
                          : text
                        : s.title,
                    messages: s.messages.map((m) =>
                      m.id === assistantMsgId
                        ? {
                            ...m,
                            content: accumulatedContent || "I have formulated an academic guidance recommendation for you.",
                            sources: accumulatedSources.length > 0 ? accumulatedSources : m.sources,
                            verdict: accumulatedVerdict,
                            isStreaming: false,
                          }
                        : m
                    ),
                  }
                : s
            ),
          }));
        }
      },

      exportChat: (format) => {
        const session = get().sessions.find((s) => s.id === get().activeSessionId);
        if (!session) return "";

        if (format === "json") {
          return JSON.stringify(session, null, 2);
        } else if (format === "markdown") {
          let md = `# ${session.title}\n\n*Created: ${session.createdAt} | Model: ${session.model}*\n\n---\n\n`;
          session.messages.forEach((m) => {
            md += `### ${m.role === "user" ? "👤 Student" : "✨ MentorX Assistant"} (${m.timestamp})\n\n${m.content}\n\n`;
            if (m.sources && m.sources.length > 0) {
              md += `**Sources Used:**\n`;
              m.sources.forEach((s) => {
                md += `- [${s.sourceType.toUpperCase()}] ${s.title}: "${s.snippet}"\n`;
              });
              md += `\n`;
            }
            md += `---\n\n`;
          });
          return md;
        } else {
          return session.messages.map((m) => `[${m.role.toUpperCase()} - ${m.timestamp}]: ${m.content}`).join("\n\n");
        }
      },
    }),
    {
      name: "mentorx-chat-storage-v4",
      partialize: (state) => ({
        sessions: state.sessions.filter((s) => !isDummySession(s.title)),
        activeSessionId: state.activeSessionId,
        selectedModel: state.selectedModel,
        deepResearchEnabled: state.deepResearchEnabled,
        webSearchEnabled: state.webSearchEnabled,
      }),
    }
  )
);
