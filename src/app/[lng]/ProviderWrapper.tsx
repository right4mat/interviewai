"use client";
import { AuthProvider } from "@/utils/auth";
import { QueryClientProvider } from "@/utils/db";
import type { ReactNode } from "react";

// @types
interface ProviderWrapperProps {
  children: ReactNode;
}

/***************************  COMMON - CONFIG, THEME  ***************************/

export default function ProviderWrapper({ children }: ProviderWrapperProps) {
  return (
      <QueryClientProvider>
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
      </QueryClientProvider>
  );
}
