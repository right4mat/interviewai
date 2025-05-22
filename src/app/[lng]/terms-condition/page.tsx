// @next
import dynamic from "next/dynamic";
import type { ReactElement } from "react";

// @project
const TermsCondition = dynamic(() => import("@/views/termsCondition/termsCondition"));

/***************************  PAGE - ROOT  ***************************/

export default function HomePage(): ReactElement {
  return <TermsCondition />;
}
