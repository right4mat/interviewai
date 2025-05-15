// @next
import dynamic from 'next/dynamic';

// @project
import { SEO_CONTENT } from '@/metadata';

const Auth = dynamic(() => import('@/views/auth/signIn'));

/***************************  METADATA - CONTACT  ***************************/

export const metadata = { ...SEO_CONTENT.contactUs };

/***************************  PAGE - AUTH  ***************************/

export default function AuthPage() {
  return <Auth />;
}
