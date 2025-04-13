// @next
import dynamic from "next/dynamic";

// @project
const Settings = dynamic(() => import("@/views/dashboard/settings"));

/***************************  PAGE - ROOT  ***************************/

export default function SettingsPage() {
  return <Settings />;
}
