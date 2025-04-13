import { NextRequest, NextResponse } from 'next/server';
import requireAuth from '../_require-auth';
import { getUser, getCustomer, createCustomer } from '../_db';
import stripe from '../_stripe';

export const POST = requireAuth(async (req: NextRequest, user: any) => {
  const body = await req.json();

  if (!body.priceId) {
    return NextResponse.json(
      {
        status: "error",
        message: "No priceId is defined in request body",
      },
      { status: 400 }
    );
  }

  try {
    const { email } = await getUser(user.id);
    let { stripeCustomerId } = (await getCustomer(user.id)) || {};

    // If user is not a customer then create a customer in Stripe
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({ email: email });

      await createCustomer(user.id, {
        stripeCustomerId: customer.id,
      });

      stripeCustomerId = customer.id;
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      subscription_data: {
        // Add a trial period for this subscription
        trial_period_days: 14,
        // Uncomment to add a coupon code from request body
        //coupon: body.coupon
      },
    
      line_items: [
        {
          price: body.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      // Uncomment to allow user to enter a promotional code
      //allow_promotion_codes: true,
      // Uncomment if you need address collection
      //billing_address_collection: "required",
      //shipping_address_collection: { allowed_countries: ['US'] },
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
    });

    // Create a checkout session
    /*const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      subscription_data: {
        // Add a trial period for this subscription
        trial_period_days: 14,
        // Uncomment to add a coupon code from request body
        //coupon: body.coupon
      },
      line_items: [
        {
          price: body.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      // Uncomment to allow user to enter a promotional code
      //allow_promotion_codes: true,
      // Uncomment if you need address collection
      //billing_address_collection: "required",
      //shipping_address_collection: { allowed_countries: ['US'] },
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
    });*/

    // Return success response
    return NextResponse.json({ status: "success", data: session });
  } catch (error: any) {
    console.log("stripe-create-checkout-session error", error);

    // Return error response
    return NextResponse.json(
      { status: "error", code: error.code, message: error.message },
      { status: 400 }
    );
  }
});
