// @next
import dynamic from "next/dynamic";

// @project
const ScrollFab = dynamic(() => import("@/components/shared/ScrollFab"));
const InterviewListing = dynamic(() => import("@/views/app/interviewListing"));
/***************************  PAGE - ROOT  ***************************/

export default function DashboardPage() {
  return (
    <>
      <InterviewListing />
      {/* scroll to top section */}
      <ScrollFab />
    </>
  );
}
