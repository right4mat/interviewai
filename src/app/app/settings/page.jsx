// @next
import dynamic from "next/dynamic";

// @project
const Settings = dynamic(() => import("@/views/app/settings"));

/***************************  PAGE - ROOT  ***************************/

export default function SettingsPage() {
  return <Settings />;
}
