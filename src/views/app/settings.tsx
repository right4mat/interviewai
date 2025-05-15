"use client";
// @project
import Settings from "@/blocks/app/Settings";
import { settings } from "@/views/app/data/settings";

/***************************  PAGE - AUTH  ***************************/

export default function SettingsPage() {
  return <Settings {...settings} />;
}
