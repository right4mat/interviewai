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
    heading: 'Acceptance of Terms',
    caption:
      'By accessing and using this website, you agree to be bound by these Terms and Conditions of Use. If you do not agree with any part of these terms, you must not use the website. shares information about you when you use our website or services. By accessing or using our website, you consent to the practices described in this policy.'
  },
  {
    id: 'changes-to-terms',
    heading: 'Changes to Terms',
    caption:
      'We reserve the right to modify or replace these terms at our sole discretion. It is your responsibility to check these terms periodically for changes. Your continued use of the website after the posting of any changes constitutes acceptance of those changes.'
  },
  {
    id: 'user-conduct',
    heading: 'User Conduct',
    caption:
      'You agree to use this website only for lawful purposes and in a manner consistent with all applicable local, national, and international laws and regulations.'
  },
  {
    id: 'intellectual-property',
    heading: 'Intellectual Property',
    caption:
      'All content on this website, including but not limited to text, graphics, logos, images, audio clips, video clips, digital downloads, and data compilations, is the property of [Your Company Name] or its content suppliers and protected by international copyright laws.'
  },
  {
    id: 'privacy-policy',
    heading: 'Privacy Policy',
    caption:
      'We do not sell, trade, or otherwise transfer your personal information to third parties. We may share information with trusted service providers who assist us in operating our website, conducting our business, or servicing you.'
  },
  {
    id: 'user-generated-content',
    heading: 'User-Generated Content',
    caption:
      'If you submit any material to this website, you grant [Your Company Name] a perpetual, royalty-free, worldwide license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such material.'
  },
  {
    id: 'limitation-of-liability',
    heading: 'Limitation of Liability',
    caption:
      'In no event shall [Your Company Name] or its affiliates be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use this website.'
  },
  {
    id: 'indemnity',
    heading: 'Indemnity',
    caption:
      "You agree to indemnify and hold harmless [Your Company Name] and its affiliates from any claims, actions, demands, damages, liabilities, costs, or expenses, including reasonable attorneys' fees, arising out of or related to your use of the website or any violation of these terms."
  },
  {
    id: 'governing-law',
    heading: 'Governing Law',
    caption:
      'These terms are governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law principles.'
  } 
]
}
