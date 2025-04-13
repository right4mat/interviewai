import { scrollToSection } from "@/utils/util";
import { PAGE_PATH } from "@/path";
import { AppBarConfig } from "@/components/shared/AppAppBar";

export const appBar: AppBarConfig = {
  logo: {
    onClick: () => scrollToSection("hero"),
  },
  navigationItems: [
    {
      label: "Features",
      onClick: () => scrollToSection("features"),
    },
    {
      label: "Testimonials",
      onClick: () => scrollToSection("testimonials"),
    },
    {
      label: "Highlights",
      onClick: () => scrollToSection("highlights"),
    },
    {
      label: "Pricing",
      onClick: () => scrollToSection("pricing"),
    },
    {
      label: "FAQ",
      onClick: () => scrollToSection("faq"),
    },
    {
      label: "Blog",
      onClick: () => scrollToSection("blog"),
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
