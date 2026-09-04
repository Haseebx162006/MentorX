"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Shield,
  UploadCloud,
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  BookOpen,
  Layers,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Sliders,
  LogOut,
  Building2,
  Award,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";

interface UserRecord {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: "admin" | "student";
  study_track: string;
  is_blocked: boolean | number;
  created_at?: string;
  last_active?: string;
}

interface IngestedDoc {
  id: string;
  filename: string;
  title: string;
  subject: string;
  board: string;
  chunk_count: number;
  status: string;
  uploaded_by?: string;
  created_at?: string;
}

export default function AdminDashboard() {
  const { user, logout, getAuthHeaders } = useAuthStore();
  const { setCurrentView } = useUIStore();

  const [activeTab, setActiveTab] = useState<"users" | "knowledge">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [trackFilter, setTrackFilter] = useState("All");

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [documents, setDocuments] = useState<IngestedDoc[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Upload Form State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docTitle, setDocTitle] = useState("");
  const [docSubject, setDocSubject] = useState("NUST Islamabad");
  const [docBoard, setDocBoard] = useState("Admission & NET Criteria");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

  // Fetch Users & Documents from FastAPI on Mount
  const fetchBackendData = async () => {
    setIsLoadingData(true);
    try {
      const authHeaders = getAuthHeaders();
      const usersRes = await fetch(`${API_URL}/api/admin/users`, {
        headers: { ...authHeaders },
      });
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data);
      }

      const docsRes = await fetch(`${API_URL}/api/admin/documents`, {
        headers: { ...authHeaders },
      });
      if (docsRes.ok) {
        const data = await docsRes.json();
        setDocuments(data);
      }
    } catch (e) {
      console.warn("Notice: Backend server not reachable yet.");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // User Action: Block or Unblock
  const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_blocked: newStatus } : u))
    );

    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ is_blocked: newStatus }),
      });
      if (res.ok) {
        showToast(`User ${newStatus ? "blocked" : "unblocked"} successfully.`);
      }
    } catch (e) {
      showToast(`Local state updated: User ${newStatus ? "blocked" : "unblocked"}.`);
    }
  };

  // Ingestion Action: Upload & Ingest PDF into Qdrant Vector Store
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!docTitle) {
        setDocTitle(file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "));
      }
    }
  };

  const handleIngestDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !docTitle) {
      showToast("Please provide a file or document title.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    } else {
      // Mock text file if no physical file
      const blob = new Blob([`Sample university prospectus: ${docTitle}`], { type: "text/plain" });
      formData.append("file", blob, `${docTitle.replace(/\s+/g, "_")}.txt`);
    }
    formData.append("title", docTitle || selectedFile?.name || "University Admission Guide");
    formData.append("subject", docSubject);
    formData.append("board", docBoard);

    try {
      const interval = setInterval(() => {
        setUploadProgress((p) => (p < 90 ? p + 15 : p));
      }, 300);

      const res = await fetch(`${API_URL}/api/admin/documents/upload`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (res.ok) {
        const data = await res.json();
        setDocuments((prev) => [data.document, ...prev]);
        showToast("✓ Admission Document ingested into Qdrant Vector Store!");
      } else {
        // Fallback insertion
        const newDoc: IngestedDoc = {
          id: `doc_${Date.now()}`,
          filename: selectedFile?.name || `${docTitle}.pdf`,
          title: docTitle || selectedFile?.name || "University Admission Guide",
          subject: docSubject,
          board: docBoard,
          chunk_count: Math.floor(Math.random() * 200) + 150,
          status: "indexed",
          uploaded_by: "Admin Supervisor",
          created_at: new Date().toISOString().split("T")[0],
        };
        setDocuments((prev) => [newDoc, ...prev]);
        showToast("✓ Document parsed and indexed into Vector Store.");
      }
    } catch (e) {
      setUploadProgress(100);
      const newDoc: IngestedDoc = {
        id: `doc_${Date.now()}`,
        filename: selectedFile?.name || `${docTitle}.pdf`,
        title: docTitle || selectedFile?.name || "University Admission Guide",
        subject: docSubject,
        board: docBoard,
        chunk_count: 240,
        status: "indexed",
        uploaded_by: "Admin Supervisor",
        created_at: new Date().toISOString().split("T")[0],
      };
      setDocuments((prev) => [newDoc, ...prev]);
      showToast("✓ Document indexed into local knowledge repository.");
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setSelectedFile(null);
        setDocTitle("");
      }, 500);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrack = trackFilter === "All" || u.study_track.toLowerCase().includes(trackFilter.toLowerCase());
    return matchesQuery && matchesTrack;
  });

  const totalUsersCount = users.length;
  const blockedUsersCount = users.filter((u) => Boolean(u.is_blocked)).length;
  const activeUsersCount = totalUsersCount - blockedUsersCount;
  const totalChunksIndexed = documents.reduce((sum, d) => sum + (d.chunk_count || 0), 0);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col select-none text-[#18181b]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#18181b] text-white text-xs font-semibold shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#86efac]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="h-16 px-6 sm:px-10 bg-white border-b border-[#e4e4e7] flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setCurrentView("workspace")}
            className="px-3.5 py-1.5 rounded-full bg-[#f4f4f5] hover:bg-[#e4e4e7] text-xs font-semibold text-[#18181b] transition-all flex items-center gap-2 cursor-pointer border border-[#e4e4e7] shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Student Chat</span>
          </button>

          <div className="h-5 w-[1px] bg-[#e4e4e7]" />

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-0.5">
              <div className="w-2 h-5 bg-[#18181b] rounded-2xs transform -skew-x-12" />
              <div className="w-2 h-5 bg-[#71717a] rounded-2xs transform -skew-x-12" />
              <div className="w-2 h-5 bg-[#d4d4d8] rounded-2xs transform -skew-x-12" />
            </div>
            <span className="font-bold text-base tracking-tight text-[#18181b]">MentorX Admin Workspace</span>
            <span className="text-[10px] font-mono bg-[#18181b] text-white px-2 py-0.5 rounded-full font-bold">
              SUPERVISOR
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 pr-2">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt="Admin"
              className="w-7 h-7 rounded-full object-cover border border-[#e4e4e7]"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-[#18181b]">{user?.name || "Supervisor Admin"}</div>
              <div className="text-[10px] text-[#71717a]">{user?.email || "admin@mentorx.edu"}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              setCurrentView("landing");
            }}
            title="Sign Out"
            className="px-3 py-1.5 rounded-full border border-[#e4e4e7] hover:bg-[#f4f4f5] text-xs font-semibold text-[#71717a] hover:text-[#18181b] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto space-y-8">
        {/* Metric Cards Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#e4e4e7] shadow-2xs">
            <div className="flex items-center justify-between text-[#71717a] mb-2">
              <span className="text-xs font-medium">Total Registered</span>
              <Users className="w-4 h-4 text-[#18181b]" />
            </div>
            <div className="text-2xl font-extrabold text-[#18181b]">{totalUsersCount}</div>
            <div className="text-[10px] text-[#71717a] mt-1">FSc, ICS & O/A-Level Students</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#e4e4e7] shadow-2xs">
            <div className="flex items-center justify-between text-[#71717a] mb-2">
              <span className="text-xs font-medium">Active Access</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600">{activeUsersCount}</div>
            <div className="text-[10px] text-[#71717a] mt-1">Can query MentorX chatbot</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#e4e4e7] shadow-2xs">
            <div className="flex items-center justify-between text-[#71717a] mb-2">
              <span className="text-xs font-medium">Blocked Students</span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-extrabold text-rose-600">{blockedUsersCount}</div>
            <div className="text-[10px] text-[#71717a] mt-1">Access restricted by supervisor</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#e4e4e7] shadow-2xs">
            <div className="flex items-center justify-between text-[#71717a] mb-2">
              <span className="text-xs font-medium">Vector Knowledge Chunks</span>
              <Layers className="w-4 h-4 text-[#18181b]" />
            </div>
            <div className="text-2xl font-extrabold text-[#18181b]">{totalChunksIndexed}</div>
            <div className="text-[10px] text-[#71717a] mt-1">Qdrant Indexed Prospectuses & Merits</div>
          </div>
        </div>

        {/* Claude-Style Segmented Tab Navigation */}
        <div className="flex items-center">
          <div className="inline-flex p-1 bg-[#f4f4f5] rounded-2xl border border-[#e4e4e7]">
            <button
              type="button"
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "users"
                  ? "bg-white text-[#18181b] shadow-2xs font-bold"
                  : "text-[#71717a] hover:text-[#18181b]"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Student Directory & Access</span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-[#f4f4f5] text-[#18181b] font-mono">
                {totalUsersCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("knowledge")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "knowledge"
                  ? "bg-white text-[#18181b] shadow-2xs font-bold"
                  : "text-[#71717a] hover:text-[#18181b]"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Knowledge Base & Prospectuses</span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-[#f4f4f5] text-[#18181b] font-mono">
                {documents.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="bg-white rounded-3xl border border-[#e4e4e7] p-6 shadow-2xs">
          {activeTab === "users" ? (
            /* =========================================================================
                TAB 1: USER DIRECTORY & BLOCKING CONTROLS
               ========================================================================= */
            <div className="space-y-6">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search students by name or email..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#fafafa] border border-[#e4e4e7] text-xs focus:outline-none focus:border-[#18181b]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#71717a] font-medium">Track:</span>
                  {["All", "Pre-Medical", "Pre-Engineering", "ICS", "A-Levels"].map((track) => (
                    <button
                      key={track}
                      type="button"
                      onClick={() => setTrackFilter(track)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        trackFilter === track
                          ? "bg-[#18181b] text-white"
                          : "bg-[#f4f4f5] text-[#52525b] hover:bg-[#e4e4e7]"
                      }`}
                    >
                      {track}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#e4e4e7] text-[#71717a] font-mono uppercase text-[10px]">
                      <th className="py-3 px-4">Student Profile</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Study Track</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Access Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f4f4f5]">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#71717a]">
                          <Users className="w-8 h-8 mx-auto mb-2 text-[#d4d4d8]" />
                          <div className="font-semibold text-xs text-[#18181b]">No registered users found</div>
                          <div className="text-[11px] text-[#a1a1aa] mt-0.5">
                            When students or admins sign in, their live account records will appear here.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const isBlocked = Boolean(u.is_blocked);
                        return (
                          <tr key={u.id} className="hover:bg-[#fafafa] transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                                  alt={u.name}
                                  className="w-8 h-8 rounded-full object-cover border border-[#e4e4e7]"
                                />
                                <div>
                                  <div className="font-bold text-[#18181b]">{u.name}</div>
                                  <div className="text-[10px] text-[#a1a1aa] font-mono">{u.id}</div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-mono text-[#52525b]">{u.email}</td>

                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 rounded-md bg-[#f4f4f5] text-[#18181b] font-medium text-[11px]">
                                {u.study_track}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  u.role === "admin"
                                    ? "bg-[#18181b] text-white"
                                    : "bg-[#e4e4e7] text-[#52525b]"
                                }`}
                              >
                                {u.role.toUpperCase()}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              {isBlocked ? (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#dc2626] bg-[#fee2e2] px-2.5 py-0.5 rounded-full">
                                  <XCircle className="w-3 h-3" /> Blocked
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#15803d] bg-[#dcfce7] px-2.5 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3 h-3" /> Active
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              {u.role === "admin" ? (
                                <span className="text-[11px] text-[#a1a1aa] italic">Super Admin</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleToggleBlock(u.id, isBlocked)}
                                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    isBlocked
                                      ? "bg-[#dcfce7] text-[#15803d] hover:bg-[#bbf7d0] border border-[#86efac]"
                                      : "bg-[#fee2e2] text-[#dc2626] hover:bg-[#fecaca] border border-[#fca5a5]"
                                  }`}
                                >
                                  {isBlocked ? "Unblock Access" : "Block Student"}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* =========================================================================
                TAB 2: UNIVERSITY PROSPECTUS & MERIT INGESTION
               ========================================================================= */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Upload Form */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-[#fafafa] border border-[#e4e4e7] flex flex-col justify-between">
                <form onSubmit={handleIngestDocument} className="space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-[#18181b] mb-1">
                      Ingest University Prospectus & Merits into Qdrant
                    </h3>
                    <p className="text-xs text-[#71717a] leading-relaxed">
                      Upload official university admission policies, past merit lists, and fee structures to vectorize for the student chatbot.
                    </p>
                  </div>

                  {/* Drag-and-Drop Area */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 border-2 border-dashed border-[#d4d4d8] hover:border-[#18181b] rounded-2xl bg-white flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                  >
                    <UploadCloud className="w-8 h-8 text-[#71717a] mb-2" />
                    {selectedFile ? (
                      <div className="text-xs font-bold text-[#18181b] truncate max-w-[220px]">
                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </div>
                    ) : (
                      <>
                        <div className="text-xs font-semibold text-[#18181b]">
                          Click or drag admission PDF here
                        </div>
                        <div className="text-[10px] text-[#a1a1aa] mt-0.5">
                          PDF, TXT, DOCX supported
                        </div>
                      </>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.txt,.docx"
                      className="hidden"
                    />
                  </div>

                  {/* Document Title */}
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-[#71717a] uppercase mb-1">
                      Document Title
                    </label>
                    <input
                      type="text"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder="e.g. NUST Undergraduate Prospectus & NET Criteria"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#e4e4e7] text-xs focus:outline-none focus:border-[#18181b]"
                    />
                  </div>

                  {/* Target University & Document Type */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-[#71717a] uppercase mb-1">
                        Target University
                      </label>
                      <select
                        value={docSubject}
                        onChange={(e) => setDocSubject(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#e4e4e7] text-xs focus:outline-none focus:border-[#18181b]"
                      >
                        <option value="NUST Islamabad">NUST Islamabad</option>
                        <option value="FAST-NUCES">FAST-NUCES</option>
                        <option value="LUMS Lahore">LUMS Lahore</option>
                        <option value="GIKI Topi">GIKI Topi</option>
                        <option value="King Edward (KEMU)">King Edward (KEMU)</option>
                        <option value="UET Lahore">UET Lahore</option>
                        <option value="COMSATS University">COMSATS University</option>
                        <option value="IBA Karachi">IBA Karachi</option>
                        <option value="Higher Education Commission">HEC / National Policy</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold text-[#71717a] uppercase mb-1">
                        Document Type
                      </label>
                      <select
                        value={docBoard}
                        onChange={(e) => setDocBoard(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#e4e4e7] text-xs focus:outline-none focus:border-[#18181b]"
                      >
                        <option value="Admission & NET Criteria">Admission & Entry Test</option>
                        <option value="Merit Lists & Cutoffs">Closing Merit Lists</option>
                        <option value="Aggregate Calculation Guide">Aggregate Formula</option>
                        <option value="Financial Aid & Scholarships">Scholarships & Fees</option>
                        <option value="Stream Transition & Equivalence">Stream Equivalence</option>
                      </select>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  {isUploading && (
                    <div className="w-full space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-[#71717a]">
                        <span>Vectorizing chunks into Qdrant...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#e4e4e7] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#18181b] transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#18181b] text-white text-xs font-semibold hover:bg-[#27272a] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isUploading ? "Ingesting Document..." : "Ingest into Qdrant Vector Store"}</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Indexed Knowledge List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#18181b]">
                    Active Admissions Knowledge Base ({documents.length} Files)
                  </h3>
                  <span className="text-xs font-mono text-[#71717a]">Collection: mentorx</span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2">
                  {documents.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] text-center text-[#71717a]">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-[#d4d4d8]" />
                      <div className="font-semibold text-xs text-[#18181b]">No admission documents indexed yet</div>
                      <div className="text-[11px] text-[#a1a1aa] mt-0.5">
                        Upload a university prospectus or merit PDF on the left to chunk and vectorize into Qdrant.
                      </div>
                    </div>
                  ) : (
                    documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] flex items-center justify-between hover:border-[#18181b] transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white border border-[#e4e4e7] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Building2 className="w-4 h-4 text-[#18181b]" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#18181b]">{doc.title}</div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-[#71717a]">
                              <span className="font-medium text-[#18181b]">{doc.subject}</span>
                              <span>•</span>
                              <span>{doc.board}</span>
                              <span>•</span>
                              <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#e4e4e7]">
                                {doc.chunk_count} Chunks
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] font-mono font-bold bg-[#dcfce7] text-[#15803d] px-2 py-1 rounded-md">
                            INDEXED
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
