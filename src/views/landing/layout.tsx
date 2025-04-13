"use client";
import React, { ReactNode } from "react";

import useScrollPosition from "@/hooks/useScrollPosition";

// @types
interface MainLayoutProps {
  children: ReactNode;
}

/***************************  LAYOUT - MAIN  ***************************/

export default function MainLayout({ children }: MainLayoutProps) {
  useScrollPosition();

  return <>{children}</>;
}
