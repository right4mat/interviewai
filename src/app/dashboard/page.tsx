// @next
import dynamic from "next/dynamic";

// @project
const ScrollFab = dynamic(() => import("@/components/shared/ScrollFab"));
const Dashboard = dynamic(() => import("@/views/dashboard/dashboard"));

/***************************  PAGE - ROOT  ***************************/

export default function DashboardPage() {
  return (
    <>
      <Dashboard />
      {/* scroll to top section */}
      <ScrollFab />
    </>
  );
}
