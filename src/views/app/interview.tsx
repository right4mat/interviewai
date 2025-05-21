"use client";

// @project

import InterviewStepper from "@/blocks/app/interview/InterviewStepper";
import Header from "@/components/app/Header";

/***************************  PAGE - AUTH  ***************************/

export default function DashboardPage() {
  return (
    <>
      <Header breadcrumbs={[{ label: "Home", url: "/app" }, { label: "Interview", url: "/app/interview" }]} />
      <InterviewStepper />
    </>
  );
}
