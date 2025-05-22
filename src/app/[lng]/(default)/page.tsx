// @next
import dynamic from "next/dynamic";
import type { ReactElement } from "react";

// @project
//const ScrollFab = dynamic(() => import('@/components/ScrollFab'));
const Main = dynamic(() => import("@/views/landing/landing"));

/***************************  PAGE - ROOT  ***************************/

export default function HomePage(): ReactElement {
  return <Main />;
}
