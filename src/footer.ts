import branding from "@/branding.json";
import { PAGE_PATH } from "@/path";

interface Link {
  label: string;
  path: string;
}

interface SocialLink extends Link {
  icon: string;
}

interface Section {
  title: string;
  links: Link[];
}

interface FooterContent {
  copyright: {
    text: string;
    link: Link;
  };
  newsletter: {
    title: string;
    description: string;
    inputLabel: string;
    inputPlaceholder: string;
    buttonText: string;
  };
  sections: {
    product: Section;
    company: Section;
    legal: Section;
  };
  bottomLinks: {
    privacyPolicy: Link;
    termsOfService: Link;
  };
  socialLinks: {
    github: SocialLink;
    linkedin: SocialLink;
    [key: string]: SocialLink;
  };
}

export const footerContent: FooterContent = {
  copyright: {
    text: `Copyright © ${branding.brandName} ${new Date().getFullYear()}`,
    link: {
      label: "Privacy Policy",
      path: PAGE_PATH.privacyPolicyPage
    }
  },
  newsletter: {
    title: "Join the newsletter",
    description: `Subscribe for weekly updates from ${branding.brandName}. No spams ever!`,
    inputLabel: "Email",
    inputPlaceholder: "Your email address",
    buttonText: "Subscribe"
  },
  sections: {
    product: {
      title: "",
      links: [
        /*{ label: 'Features', path: PAGE_PATHS.features },
        { label: 'Testimonials', path: PAGE_PATHS.testimonials },
        { label: 'Highlights', path: PAGE_PATHS.highlights },
        { label: 'Pricing', path: PAGE_PATHS.pricing },
        { label: 'FAQs', path: PAGE_PATHS.faqs }*/
      ]
    },
    company: {
      title: branding.brandName,
      links: [
        { label: "About us", path: PAGE_PATH.aboutPage }
        /* { label: 'Careers', path: PAGE_PATHS.careers },
        { label: 'Press', path: PAGE_PATHS.press }*/
      ]
    },
    legal: {
      title: "Legal",
      links: [
        { label: "Terms", path: PAGE_PATH.termsConditionPage },
        { label: "Privacy", path: PAGE_PATH.privacyPolicyPage }
        /* { label: 'Contact', path: PAGE_PATHS.contact }*/
      ]
    }
  },
  bottomLinks: {
    privacyPolicy: { label: "Privacy Policy", path: PAGE_PATH.privacyPolicyPage },
    termsOfService: { label: "Terms of Service", path: PAGE_PATH.termsConditionPage }
  },
  socialLinks: {
    github: { label: "GitHub", path: branding.company.socialLink?.github, icon: "GitHubIcon" },
    twitter: { label: "X", path: branding.company.socialLink?.facebook, icon: "TwitterIcon" },
    linkedin: { label: "LinkedIn", path: branding.company.socialLink?.linkedin, icon: "LinkedInIcon" }
  }
};
