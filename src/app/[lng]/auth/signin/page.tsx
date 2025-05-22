// @next
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import type { ReactNode } from "react";

// @project
import { SEO_CONTENT } from "@/metadata";

const SignIn = dynamic(() => import("@/views/auth/signIn"));

/***************************  METADATA - SIGNIN  ***************************/

export const metadata: Metadata = { ...SEO_CONTENT.contactUs };

/***************************  PAGE - SIGNIN  ***************************/

export default function SignInPage(): ReactNode {
  return <SignIn />;
}
