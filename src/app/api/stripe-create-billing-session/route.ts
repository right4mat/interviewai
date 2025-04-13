import { NextRequest, NextResponse } from 'next/server';
import requireAuth from '../_require-auth';
import { getCustomer } from '../_db';
import stripe from '../_stripe';

export const POST = requireAuth(async (req: NextRequest, user: any) => {
  try {
    console.log(req);
    const body = await req.json();
   
    const customer = await getCustomer(user.id);
    const stripeCustomerId = customer?.stripeCustomerId;

    if (typeof stripeCustomerId !== "string") {
      return NextResponse.json({ status: "error", message: "Customer not found" }, { status: 400 });
    }

    // Create a billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: body.returnUrl,
    });

    // Return success response
    return NextResponse.json({ status: "success", data: session });
  } catch (error: any) {
    console.log("stripe-create-billing-session error", error);

    // Return error response
    return NextResponse.json(
      { status: "error", code: error.code, message: error.message },
      { status: 400 }
    );
  }
});
