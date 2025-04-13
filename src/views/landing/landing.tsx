"use client";
import * as React from "react";
import Divider from "@mui/material/Divider";
import AppAppBar from "@/components/shared/AppAppBar";
import { Hero } from "@/components/landing/Hero";
import { Clientele } from "@/components/landing/Clientele";
import { Highlights } from "@/components/landing/Highlights";
import { Pricing } from "@/components/landing/Pricing";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import Footer from "@/components/shared/Footer";
import { hero } from "@/views/landing/data/hero";
import { clientele } from "@/views/landing/data/clientele";
import { features } from "@/views/landing/data/features";
import { testimonials } from "@/views/landing/data/testimonials";
import { highlights } from "@/views/landing/data/highlights";
import { pricing } from "@/views/landing/data/pricing";
import { faq } from "@/views/landing/data/faq";
import { appBar } from "@/views/landing/data/appAppBar";

export default function LandingPage() {
  return (
    <>
      <AppAppBar {...appBar} />
      <Hero {...hero} />
      <div>
        <div id="clientele">
          <Clientele {...clientele} />
        </div>
        <div id="features">
          <Features {...features} />
        </div>

        <Divider />
        <div id="testimonials">
          <Testimonials {...testimonials} />
        </div>
        <Divider />
        <div id="highlights">
          <Highlights {...highlights} />
        </div>
        <Divider />
        <div id="pricing">
          <Pricing {...pricing} />
        </div>
        <Divider />
        <div id="faq">
          <FAQ {...faq} />
        </div>
        <Divider />
        <Footer />
      </div>
    </>
  );
}
