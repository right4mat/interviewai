"use client";
import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import useScrollPosition from "@/hooks/useScrollPosition";
import AppAppBar from "@/components/shared/AppAppBar";
import Footer from "@/components/shared/Footer";
/***************************  LAYOUT - MAIN  ***************************/

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  useScrollPosition();

  return <>{children}</>;
}
