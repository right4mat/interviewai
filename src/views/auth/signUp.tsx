"use client";

// @project
import SignUp from "@/blocks/auth/SignUp";
import { auth } from "./data/auth";

/***************************  PAGE - AUTH  ***************************/
interface SignUpProps {}
export default function SignUpPage({}: SignUpProps) {
  const defaults = auth.defaults;

  return <SignUp {...defaults} />;
}
