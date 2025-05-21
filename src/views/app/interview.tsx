"use client";

// @project

import InterviewStepper from "@/blocks/app/interview/InterviewStepper";
import Header from "@/components/app/Header";
import { useT } from "@/i18n/client";
/***************************  PAGE - AUTH  ***************************/

export default function DashboardPage() {
  const { t } = useT('app');
  return (
    <>
      <Header breadcrumbs={[{ label: t("breadcrumbs.home"), url: "/app" }, { label: t("breadcrumbs.interview"), url: "/app/interview" }]} />
      <InterviewStepper />
    </>
  );
}
