import type { ReactNode } from "react";
// @next
import dynamic from "next/dynamic";

// @project
const ScrollFab = dynamic(() => import('@/components/shared/ScrollFab'));
const MainLayout = dynamic(() => import("@/views/privacyPolicy/layout"));

/***************************  LAYOUT - AI  ***************************/

interface LandingLayoutProps {
  children: ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <MainLayout>
      <>
        {children}

        {/* scroll to top section */}
        <ScrollFab />
      </>
    </MainLayout>
  );
}
