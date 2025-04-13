// @next
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { ReactNode } from 'react';

// @project
import { SEO_CONTENT } from '@/metadata';

const SignUp = dynamic(() => import('@/views/auth/signUp'));

/***************************  METADATA - SIGNUP  ***************************/

export const metadata: Metadata = { ...SEO_CONTENT.contactUs };

/***************************  PAGE - SIGNUP  ***************************/

export default function SignUpPage(): ReactNode {
  return <SignUp />;
}
