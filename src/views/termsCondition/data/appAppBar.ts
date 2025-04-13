import { PAGE_PATH } from "@/path";

import { AppBarConfig } from "@/components/shared/AppAppBar";

export const appBar: AppBarConfig = { 
  logo: {
    href: "/",
  },
  navigationItems: [
    {
      label: "Features",
      href: "/#features",
    },
    {
      label: "Testimonials",
      href: "/#testimonials",
    },
    {
      label: "Highlights",
      href: "/#highlights",
    },
    {
      label: "Pricing",
      href: "/#pricing",
    },
    {
      label: "FAQ",
      href: "/#faq",
    },
    {
      label: "Blog",
      href: "/#blog",
    },
  ],
  authButtons: {
    signIn: {
      label: "Sign in",
      href: PAGE_PATH.signIn,
    },
    signUp: {
      label: "Sign up",
      href: PAGE_PATH.signUp,
    },
  },
};

