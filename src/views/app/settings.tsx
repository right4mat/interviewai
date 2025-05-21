"use client";
// @project
import Settings from "@/blocks/app/Settings";
import Header from "@/components/app/Header";
import { settings } from "@/views/app/data/settings";
import { useT } from "@/i18n/client";

/***************************  PAGE - AUTH  ***************************/

export default function SettingsPage() {
  const { t } = useT('app');
  return (
    <>
      <Header breadcrumbs={[{ label: t("breadcrumbs.home"), url: "/app" }, { label: t("breadcrumbs.settings"), url: "/app/settings" }]} />
      <Settings {...settings} />
    </>
  );
}
