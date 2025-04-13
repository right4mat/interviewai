"use client";

// @project
import SignIn from "@/blocks/auth/SignIn";
import { auth } from "./data/auth";

/***************************  PAGE - AUTH  ***************************/

interface SignInProps {}

export default function SignInPage({}: SignInProps) {
  const defaults = auth.defaults;

  return <SignIn {...defaults} />;
}
