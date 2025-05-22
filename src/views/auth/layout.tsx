"use client";
import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import useScrollPosition from "@/hooks/useScrollPosition";
import { useAuth } from "@/utils/auth"; // Assuming you have an auth hook
import { AFTER_AUTH_PATH } from "@/path";

/***************************  LAYOUT - MAIN  ***************************/

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const auth = useAuth(); // Get authentication status
  const router = useRouter();

  useScrollPosition();

  // Redirect to dashboard if user is already signed in
  useEffect(() => {
    if (auth.user) {
      router.push(AFTER_AUTH_PATH);
    }
  }, [auth, router]);

  return <>{children}</>;
}
