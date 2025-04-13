"use client";
import { ReactNode, Suspense } from "react";

// @next
import dynamic from "next/dynamic";

// @ui-themes
const Theme = dynamic(() => import(`@/theme/AppTheme`));

/***************************  COMMON - THEME PROVIDER  ***************************/

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
   <Theme colorMode="light">{children}</Theme> // Or a default theme/component if needed
   
  );
}
