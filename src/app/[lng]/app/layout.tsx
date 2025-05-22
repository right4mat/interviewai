import { Suspense, type ReactNode } from "react";
import dynamic from "next/dynamic";
import PageLoader from "@/images/graphics/PageLoader";

// @types

// @project
const MainLayout = dynamic(() => import("@/views/app/layout"));


/***************************  LAYOUT - AI  ***************************/

export default function DashboardLayout({ children }: { children: ReactNode }) {
  console.log("DashboardLayout");
  return (
    <MainLayout>
      {/* Notice we're not wrapping the entire layout in Suspense anymore */}
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </MainLayout>
  );
}
