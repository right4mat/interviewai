"use client";
import { loadStripe } from "@stripe/stripe-js";
import { apiRequest } from "./util";
import { BILLING_PATH, CANCEL_STRIPE_PATH, SUCCESS_STRIPE_PATH, PAGE_PATH } from "@/path";
import { useRouter } from "next/navigation";
import { getAuthUser, getUser } from "./db";

const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string, {
    // Pin to specific version of the Stripe API
    //apiVersion: "2020-08-27",
  });
};

export async function redirectToCheckout(planId: string, successUrl: string, cancelUrl: string): Promise<{ error: Error } | void> {
  // Check if user is logged in
  const user = await getAuthUser();

  if (!user) {
    // Redirect to login page if user is not logged in
    window.location.href = PAGE_PATH.signIn;
    return;
  }

  // Create a checkout session
  const checkoutSession = await apiRequest("stripe-create-checkout-session", "POST", {
    priceId: planId,
    successUrl: `${window.location.origin}${successUrl}`,
    cancelUrl: `${window.location.origin}${cancelUrl}`
  });

  // Ensure if user clicks browser back button from checkout they go to /pricing
  // instead of this page or they'll redirect right back to checkout.
  window.history.replaceState({}, "", cancelUrl);

  // Get Stripe instance and redirect to checkout
  const stripe = await getStripe();
  const result = await stripe?.redirectToCheckout({
    sessionId: checkoutSession.id
  });

  if (result?.error) {
    return { error: new Error(result.error.message) };
  }
}

export async function redirectToBilling(): Promise<void> {
  // Create a billing session
  const session = await apiRequest("stripe-create-billing-session", "POST", {
    returnUrl: `${window.location.href}`
  });

  // Ensure if user clicks browser back button from billing they go to /settings/general
  // instead of this page or they'll redirect right back to checkout.
  window.history.replaceState({}, "", window.location.href);

  // Redirect to billing session url
  window.location.href = session.url;
}
