// @next

import dynamic from "next/dynamic";

// @project
const ScrollFab = dynamic(() => import("@/components/shared/ScrollFab"));
const Home = dynamic(() => import("@/views/app/Home"));
/***************************  PAGE - ROOT  ***************************/

export default function DashboardPage() {
  return (
    <>
      <Home />
      {/* scroll to top section */}
      <ScrollFab />
    </>
  );
}
