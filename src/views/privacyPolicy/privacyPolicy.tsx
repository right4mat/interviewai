"use client";

// @project
import PrivacyPolicy from "@/blocks/privacyPolicy/PrivacyPolicy";
import AppAppBar from "@/components/shared/AppAppBar";
import SmallHero from "@/components/shared/SmallHero";
import Footer from "@/components/shared/Footer";
import { appBar } from "@/views/privacyPolicy/data/appAppBar";
import { privacyPolicy } from "@/views/privacyPolicy/data/privacyPolicy";
import { hero } from "@/views/privacyPolicy/data/hero";

/***************************  PAGE - AUTH  ***************************/

interface PrivacyPolicyProps {}

export default function PrivacyPolicyPage({}: PrivacyPolicyProps) {
  return (
    <>
      <AppAppBar {...appBar} />
      <SmallHero {...hero} />
      <PrivacyPolicy {...privacyPolicy} />
      <Footer />
    </>
  );
}
