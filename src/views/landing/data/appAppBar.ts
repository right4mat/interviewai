"use client";
import { scrollToSection } from "@/utils/util";
import { PAGE_PATH } from "@/path";
import { type AppBarConfig } from "@/components/shared/AppAppBar";

export const appBar: AppBarConfig = {
  translationKey: "landing",
  logo: {
    onClick: () => scrollToSection("hero"),
  },
  navigationItems: [
    {
      label: "navigation.features",
      onClick: () => scrollToSection("features"),
    },
    {
      label: "navigation.testimonials",
      onClick: () => scrollToSection("testimonials"),
    },
    {
      label: "navigation.highlights",
      onClick: () => scrollToSection("highlights"),
    },
    {
      label: "navigation.pricing",
      onClick: () => scrollToSection("pricing"),
    },
    {
      label: "navigation.faq",
      onClick: () => scrollToSection("faq"),
    },
    {
      label: "navigation.blog",
      onClick: () => scrollToSection("blog"),
    },
  ],
  authButtons: {
    signIn: {
      label: "navigation.signIn",
      href: PAGE_PATH.signIn,
    },
    signUp: {
      label: "navigation.signUp",
      href: PAGE_PATH.signUp,
    },
  },
};
