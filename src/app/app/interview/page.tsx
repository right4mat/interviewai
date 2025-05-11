// @next
import dynamic from "next/dynamic";

// @project
const ScrollFab = dynamic(() => import("@/components/shared/ScrollFab"));
const Interview = dynamic(() => import("@/views/app/interview"));

/***************************  PAGE - ROOT  ***************************/

export default function DashboardPage() {
  return (
    <>
      <Interview />
      {/* scroll to top section */}
      <ScrollFab />
    </>
  );
}
