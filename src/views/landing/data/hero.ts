"use client";
import { scrollToSection } from "@/utils/util";

export interface HeroConfig {
  title: string,
  subtitle: string,
  info: string,
  button: {
    text: string,
    onClick: () => void
  }

}
export const hero: HeroConfig = {
  title: "hero.title",
  subtitle: "hero.subtitle",
  info: "hero.info",
  button: {
    text: "hero.button",
    onClick: () => scrollToSection("pricing")
  }
};
