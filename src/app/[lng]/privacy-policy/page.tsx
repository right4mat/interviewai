// @next
import dynamic from "next/dynamic";
import { ReactElement } from "react";

// @project
const PrivacyPolicy = dynamic(() => import("@/views/privacyPolicy/privacyPolicy"));

/***************************  PAGE - ROOT  ***************************/

export default function PrivacyPolicyPage(): ReactElement {
  return <PrivacyPolicy />;
}
