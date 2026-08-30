"use client";

import React, { useEffect, useState } from "react";
import WelcomeLoader from "@/components/loader/WelcomeLoader";
import LandingPage from "@/components/landing/LandingPage";
import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";
import { useUIStore } from "@/store/useUIStore";

export default function Home() {
  const { currentView, hasSeenLoader } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return quiet background while mounting
    return <div className="min-h-screen bg-[#f7f5fa]" />;
  }

  if (currentView === "loader" && !hasSeenLoader) {
    return <WelcomeLoader />;
  }

  if (currentView === "workspace") {
    return <WorkspaceLayout />;
  }

  return <LandingPage />;
}
