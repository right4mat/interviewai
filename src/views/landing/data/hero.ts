import { scrollToSection } from "@/utils/util";
import { HeroConfig } from "@/components/landing/Hero";
import branding from "@/branding.json";

export const hero: HeroConfig = {
  title: "Ace your interviews with ",
  subtitle: branding.brandName,
  info: "AI-powered interview training platform that helps you prepare, practice, and perfect your interview skills to land your dream job.",
  button: {
    text: "Get started",
    onClick: () => scrollToSection("pricing")
  }
};
