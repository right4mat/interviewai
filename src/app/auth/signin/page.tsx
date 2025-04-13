// @next
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { ReactNode } from "react";

// @project
import { SEO_CONTENT } from "@/metadata";

const SignIn = dynamic(() => import("@/views/auth/signIn"));

/***************************  METADATA - SIGNIN  ***************************/

export const metadata: Metadata = { ...SEO_CONTENT.contactUs };

/***************************  PAGE - SIGNIN  ***************************/

export default function SignInPage(): ReactNode {
  return <SignIn />;
}
