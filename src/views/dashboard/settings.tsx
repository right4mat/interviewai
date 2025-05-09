"use client";

// @project
import Settings from "@/blocks/dashboard/Settings";
import { settings } from "@/views/dashboard/data/settings";

/***************************  PAGE - AUTH  ***************************/

export default function DashboardPage() {
  return <Settings {...settings} />;
}
