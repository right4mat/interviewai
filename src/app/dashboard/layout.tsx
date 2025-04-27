import { ReactNode, Suspense } from "react";

// @next
import dynamic from "next/dynamic";
import PageLoader from "@/images/graphics/PageLoader";

// @types

// @project
const MainLayout = dynamic(() => import("@/views/dashboard/layout"));


/***************************  LAYOUT - AI  ***************************/

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <MainLayout>
      {/* Notice we're not wrapping the entire layout in Suspense anymore */}
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </MainLayout>
  );
}
