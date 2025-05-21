"use client";

// @project

import Home from "@/blocks/app/Home";
import Header from "@/components/app/Header";
import { useT } from "@/i18n/client";

/***************************  PAGE - AUTH  ***************************/

export default function DashboardPage() {
  const { t: tApp } = useT('app');
  return (
    <>
      <Header breadcrumbs={[{ label: tApp.breadcrumbs.home, url: "/app" }]} />
      <Home />
    </>
  );
}
