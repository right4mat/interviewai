"use client";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Divider from "@mui/material/Divider";
import AppAppBar from "@/components/shared/AppAppBar";
import { Hero } from "@/components/landing/Hero";
import { Fade } from "@mui/material";
import { hero } from "@/views/landing/data/hero";
import { clientele } from "@/views/landing/data/clientele";
import { features } from "@/views/landing/data/features";
import { testimonials } from "@/views/landing/data/testimonials";
import { highlights } from "@/views/landing/data/highlights";
import { pricing } from "@/pricing";
import { faq } from "@/views/landing/data/faq";
import { appBar } from "@/views/landing/data/appAppBar";

// Dynamically import components
const Clientele = dynamic(() => import("@/components/landing/Clientele").then(mod => mod.Clientele));
const Features = dynamic(() => import("@/components/landing/Features").then(mod => mod.Features));
const Testimonials = dynamic(() => import("@/components/landing/Testimonials").then(mod => mod.Testimonials));
const Highlights = dynamic(() => import("@/components/landing/Highlights").then(mod => mod.Highlights));
const Pricing = dynamic(() => import("@/components/landing/Pricing").then(mod => mod.Pricing));
const FAQ = dynamic(() => import("@/components/landing/FAQ").then(mod => mod.FAQ));
const Footer = dynamic(() => import("@/components/shared/Footer"));

export default function LandingPage() {
  const [visibleSections, setVisibleSections] = useState({
    clientele: false,
    features: false,
    testimonials: false,
    highlights: false,
    pricing: false,
    faq: false,
    footer: false
  });

  const [loadedSections, setLoadedSections] = useState({
    clientele: false,
    features: false,
    testimonials: false,
    highlights: false,
    pricing: false,
    faq: false,
    footer: false
  });

  const sectionRefs = {
    clientele: useRef(null),
    features: useRef(null),
    testimonials: useRef(null),
    highlights: useRef(null),
    pricing: useRef(null),
    faq: useRef(null),
    footer: useRef(null)
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute('id');
          if (id) {
            setVisibleSections(prev => ({
              ...prev,
              [id]: entry.isIntersecting
            }));
            
            // Once a section becomes visible, mark it as loaded
            if (entry.isIntersecting) {
              setLoadedSections(prev => ({
                ...prev,
                [id]: true
              }));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <AppAppBar {...appBar} />
      <Hero {...hero} />
      <div>
        <Fade in={visibleSections.clientele || loadedSections.clientele} timeout={1000}>
          <div ref={sectionRefs.clientele} id="clientele">
            <Clientele {...clientele} />
          </div>
        </Fade>

        <Fade in={visibleSections.features || loadedSections.features} timeout={1000}>
          <div ref={sectionRefs.features} id="features">
            <Features {...features} />
          </div>
        </Fade>

        <Divider />
        <Fade in={visibleSections.testimonials || loadedSections.testimonials} timeout={1000}>
          <div ref={sectionRefs.testimonials} id="testimonials">
            <Testimonials {...testimonials} />
          </div>
        </Fade>

        <Divider />
        <Fade in={visibleSections.highlights || loadedSections.highlights} timeout={1000}>
          <div ref={sectionRefs.highlights} id="highlights">
            <Highlights {...highlights} />
          </div>
        </Fade>

        <Divider />
        <Fade in={visibleSections.pricing || loadedSections.pricing} timeout={1000}>
          <div ref={sectionRefs.pricing} id="pricing">
            <Pricing {...pricing} />
          </div>
        </Fade>

        <Divider />
        <Fade in={visibleSections.faq || loadedSections.faq} timeout={1000}>
          <div ref={sectionRefs.faq} id="faq">
            <FAQ {...faq} />
          </div>
        </Fade>

        <Divider />
        <Fade in={visibleSections.footer || loadedSections.footer} timeout={1000}>
          <div ref={sectionRefs.footer} id="footer">
            <Footer />
          </div>
        </Fade>
      </div>
    </>
  );
}
