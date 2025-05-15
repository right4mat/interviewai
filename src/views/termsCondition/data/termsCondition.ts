export interface MenuItem {
  id: string;
  heading: string;
  caption: string;
}

export const menuItems: MenuItem[] = [
  { 
    id: 'acceptance-of-terms',
    heading: 'acceptanceOfTerms.heading',
    caption: 'acceptanceOfTerms.caption'
  },
  { 
    id: 'changes-to-terms',
    heading: 'changesToTerms.heading',
    caption: 'changesToTerms.caption'
  },
  { 
    id: 'user-conduct',
    heading: 'userConduct.heading',
    caption: 'userConduct.caption'
  },
  { 
    id: 'intellectual-property',
    heading: 'intellectualProperty.heading',
    caption: 'intellectualProperty.caption'
  },
  { 
    id: 'privacy-policy',
    heading: 'privacyPolicy.heading',
    caption: 'privacyPolicy.caption'
  },
  { 
    id: 'user-generated-content',
    heading: 'userGeneratedContent.heading',
    caption: 'userGeneratedContent.caption'
  },
  { 
    id: 'limitation-of-liability',
    heading: 'limitationOfLiability.heading',
    caption: 'limitationOfLiability.caption'
  },
  { 
    id: 'indemnity',
    heading: 'indemnity.heading',
    caption: 'indemnity.caption'
  },
  { 
    id: 'governing-law',
    heading: 'governingLaw.heading',
    caption: 'governingLaw.caption'
  }
];
