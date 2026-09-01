"use client";

import React, { useEffect } from "react";
import WelcomeLoader from "@/components/loader/WelcomeLoader";
import LandingPage from "@/components/landing/LandingPage";
import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AuthModal from "@/components/auth/AuthModal";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function Home() {
  const { currentView, setCurrentView, openAuthModal } = useUIStore();
  const { isAuthenticated, user } = useAuthStore();

  // Route Guard: Protect Workspace and Admin from unauthenticated access
  useEffect(() => {
    if ((currentView === "workspace" || currentView === "admin") && !isAuthenticated) {
      setCurrentView("landing");
      openAuthModal("signin");
    }
  }, [currentView, isAuthenticated, setCurrentView, openAuthModal]);

  const renderView = () => {
    if (currentView === "loader") {
      return <WelcomeLoader />;
    }

    if ((currentView === "workspace" || currentView === "admin") && !isAuthenticated) {
      return <LandingPage />;
    }

    if (currentView === "landing") {
      return <LandingPage />;
    }

    if (currentView === "admin") {
      if (user?.role !== "admin") {
        return <WorkspaceLayout />;
      }
      return <AdminDashboard />;
    }

    return <WorkspaceLayout />;
  };

  return (
    <>
      {renderView()}
      {/* Global Auth Modal so it pops up reliably on Landing, Workspace, and Admin */}
      <AuthModal />
    </>
  );
}
