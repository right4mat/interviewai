import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // Pin to specific version of the Stripe API
  apiVersion: "2025-03-31.basil",
});

export default stripe;
