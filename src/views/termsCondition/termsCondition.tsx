"use client";

// @project
import TermsCondition from "@/blocks/termsCondition/TermsCondition";
import AppAppBar from "@/components/shared/AppAppBar";
import Footer from "@/components/shared/Footer";
import SmallHero from "@/components/shared/SmallHero";
import { appBar } from "@/views/termsCondition/data/appAppBar";

/***************************  PAGE - AUTH  ***************************/

interface TermsConditionProps {}

export default function TermsConditionPage({}: TermsConditionProps) {
  return (
    <>
      <AppAppBar {...appBar} />
      <SmallHero headLine="Terms & Conditions" captionLine="Last updated: April 5, 2025" />
      <TermsCondition />
      <Footer/>
    </>
  );
}
