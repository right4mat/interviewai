"use client";
// @project
import { PAGE_PATH } from "@/path";

export interface MenuItem {
  id: string;
  heading: string;
  caption: string;
}

export interface PrivacyPolicyConfig {
  menuItems: MenuItem[];
}

export const privacyPolicy: PrivacyPolicyConfig = {

  menuItems: [
    {
      id: 'acceptance-of-terms',
      heading: 'content.acceptanceOfTerms.heading',
      caption: 'privacyPolicy.content.acceptanceOfTerms.caption'
    },
    {
      id: 'changes-to-terms',
      heading: 'content.changesToTerms.heading',
      caption: 'content.changesToTerms.caption'
    },
    {
      id: 'user-conduct',
      heading: 'content.userConduct.heading',
      caption: 'content.userConduct.caption'
    },
    {
      id: 'intellectual-property',
      heading: 'content.intellectualProperty.heading',
      caption: 'content.intellectualProperty.caption'
    },
    {
      id: 'privacy-policy',
      heading: 'content.privacyPolicy.heading',
      caption: 'content.privacyPolicy.caption'
    },
    {
      id: 'user-generated-content',
      heading: 'content.userGeneratedContent.heading',
      caption: 'content.userGeneratedContent.caption'
    },
    {
      id: 'limitation-of-liability',
      heading: 'content.limitationOfLiability.heading',
      caption: 'content.limitationOfLiability.caption'
    },
    {
      id: 'indemnity',
      heading: 'content.indemnity.heading',
      caption: 'content.indemnity.caption'
    },
    {
      id: 'governing-law',
      heading: 'content.governingLaw.heading',
      caption: 'content.governingLaw.caption'
    }
  ]
};
