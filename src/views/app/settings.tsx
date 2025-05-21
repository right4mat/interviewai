"use client";
// @project
import Settings from "@/blocks/app/Settings";
import Header from "@/components/app/Header";
import { settings } from "@/views/app/data/settings";

/***************************  PAGE - AUTH  ***************************/

export default function SettingsPage() {
  return (
    <>
      <Header breadcrumbs={[{ label: "Home", url: "/app" }, { label: "Settings", url: "/app/settings" }]} />
      <Settings {...settings} />
    </>
  );
}
