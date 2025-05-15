"use client";

// @project
import TermsCondition from "@/blocks/termsCondition/TermsCondition";
import AppAppBar from "@/components/shared/AppAppBar";
import Footer from "@/components/shared/Footer";
import SmallHero from "@/components/shared/SmallHero";
import { appBar } from "@/views/termsCondition/data/appAppBar";
import { hero } from "@/views/termsCondition/data/hero";
/***************************  PAGE - AUTH  ***************************/

interface TermsConditionProps {}

export default function TermsConditionPage({}: TermsConditionProps) {
  return (
    <>
      <AppAppBar {...appBar} />
      <SmallHero {...hero}/>
      <TermsCondition />
      <Footer/>
    </>
  );
}
