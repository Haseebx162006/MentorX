"use client";

import React, { useEffect } from "react";
import WelcomeLoader from "@/components/loader/WelcomeLoader";
import LandingPage from "@/components/landing/LandingPage";
import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useUIStore } from "@/store/useUIStore";

export default function Home() {
  const { currentView } = useUIStore();

  if (currentView === "loader") {
    return <WelcomeLoader />;
  }

  if (currentView === "landing") {
    return <LandingPage />;
  }

  if (currentView === "admin") {
    return <AdminDashboard />;
  }

  return <WorkspaceLayout />;
}
