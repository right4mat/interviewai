"use client";
import * as React from "react";
import type { ReactNode } from "react";
import Dashboard from "@/blocks/app/Dashboard";
import { requireAuth } from "@/utils/auth";
import { dashboard } from "@/views/app/data/dashboard";
// @types
interface DashboardLayoutProps {
  children: ReactNode;
}

/***************************  LAYOUT - MAIN  ***************************/

export default requireAuth(function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Dashboard {...dashboard}>
        {children}
    </Dashboard>
  );
});
