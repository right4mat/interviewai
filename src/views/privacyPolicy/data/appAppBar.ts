"use client";
import { PAGE_PATH } from "@/path";
import { AppBarConfig } from "@/components/shared/AppAppBar";

export const appBar: AppBarConfig = {
  translationKey: "privacyPolicy",
  logo: {
    href: "/",
  },
  navigationItems: [
    {
      label: "navigation.features",
      href: "/#features",
    },
    {
      label: "navigation.testimonials",
      href: "/#testimonials",
    },
    {
      label: "navigation.highlights",
      href: "/#highlights",
    },
    {
      label: "navigation.pricing",
      href: "/#pricing",
    },
    {
      label: "navigation.faq",
      href: "/#faq",
    },
    {
      label: "navigation.blog",
      href: "/#blog",
    },
  ],
  authButtons: {
    signIn: {
      label: "auth.signIn",
      href: PAGE_PATH.signIn,
    },
    signUp: {
      label: "auth.signUp",
      href: PAGE_PATH.signUp,
    },
  },
};

