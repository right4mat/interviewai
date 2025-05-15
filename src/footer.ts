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
    text: "copyright.text",
    link: {
      label: "copyright.link.label",
      path: PAGE_PATH.privacyPolicyPage
    }
  },
  newsletter: {
    title: "newsletter.title",
    description: "newsletter.description",
    inputLabel: "newsletter.inputLabel",
    inputPlaceholder: "newsletter.inputPlaceholder",
    buttonText: "newsletter.buttonText"
  },
  sections: {
    product: {
      title: "sections.product.title",
      links: []
    },
    company: {
      title: "sections.company.title",
      links: [
        { label: "links.aboutUs", path: PAGE_PATH.aboutPage }
      ]
    },
    legal: {
      title: "sections.legal.title",
      links: [
        { label: "links.terms", path: PAGE_PATH.termsConditionPage },
        { label: "links.privacy", path: PAGE_PATH.privacyPolicyPage }
      ]
    }
  },
  bottomLinks: {
    privacyPolicy: { label: "bottomLinks.privacyPolicy", path: PAGE_PATH.privacyPolicyPage },
    termsOfService: { label: "bottomLinks.termsOfService", path: PAGE_PATH.termsConditionPage }
  },
  socialLinks: {
    github: { label: "social.github", path: branding.company.socialLink?.github, icon: "GitHubIcon" },
    twitter: { label: "social.twitter", path: branding.company.socialLink?.facebook, icon: "TwitterIcon" },
    linkedin: { label: "social.linkedin", path: branding.company.socialLink?.linkedin, icon: "LinkedInIcon" }
  }
};
