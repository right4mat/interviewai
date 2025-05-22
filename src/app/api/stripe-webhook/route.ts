import { NextRequest, NextResponse } from 'next/server';
import { updateCustomerByStripeCid } from '../_db';
import stripe from '../_stripe';
import Stripe from 'stripe';

// Disable next.js body parsing (stripe needs the raw body to validate the event)
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  const headers = request.headers;

  try {
    const rawBody = await request.text();

    const stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    console.log(`stripeEvent: ${stripeEvent.type}`);

    // Get the object from stripeEvent
    const object = stripeEvent.data.object as Stripe.Event.Data.Object;

    switch (stripeEvent.type) {
      case "checkout.session.completed": {
        // Fetch subscription
        const session = object as Stripe.Checkout.Session;
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        // Add subscription info to database
        await updateCustomerByStripeCid(session.customer as string, {
          stripeSubscriptionId: subscription.id,
          // Store the Price ID for this subscription
          stripePriceId: subscription?.items?.data[0]?.price?.id,
          // Store the subscription status ("active" or "trialing")
          stripeSubscriptionStatus: subscription.status,
        });

        break;
      }

      case "invoice.paid": {
        // If a payment succeeded we update stored subscription status to "active"
        // in case it was previously "trialing" or "past_due".
        // We skip if amount due is 0 as that's the case at start of trial period.
        const invoice = object as Stripe.Invoice;
        if (invoice.amount_due > 0) {
          await updateCustomerByStripeCid(invoice.customer as string, {
            stripeSubscriptionStatus: "active",
          });
        }

        break;
      }

      case "invoice.payment_failed": {
        // If a payment failed we update stored subscription status to "past_due"
        const invoice = object as Stripe.Invoice;
        await updateCustomerByStripeCid(invoice.customer as string, {
          stripeSubscriptionStatus: "past_due",
        });

        break;
      }

      case "customer.subscription.updated": {
        const subscription = object as Stripe.Subscription;
        await updateCustomerByStripeCid(subscription.customer as string, {
          stripePriceId: subscription?.items?.data[0]?.price?.id,
          stripeSubscriptionStatus: subscription.status,
        });

        // 💡 You could also read "cancel_at_period_end" if you'd like to email user and learn why they cancelled
        // or convince them to renew before their subscription is deleted at end of payment period.
        break;
      }

      case "customer.subscription.deleted": {
        // If a subscription was deleted update stored subscription status to "canceled".
        // Keep in mind this won't be called right away if "Cancel at end of billing period" is selected
        // in Billing Portal settings (https://dashboard.stripe.com/settings/billing/portal). Instead you'll
        // get a "customer.subscription.updated" event with a cancel_at_period_end value.
        const subscription = object as Stripe.Subscription;
        await updateCustomerByStripeCid(subscription.customer as string, {
          stripeSubscriptionStatus: "canceled",
        });

        break;
      }

      case "customer.subscription.trial_will_end":
        // This event happens 3 days before a trial ends
        // 💡 You could email user letting them know their trial will end or you can have Stripe do that
        // automatically 7 days in advance: https://dashboard.stripe.com/settings/billing/automatic

        break;

      // no default
    }

    // Send success response
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.log("stripe webhook error", error);

    // Send error response
    return NextResponse.json({ 
      status: "error", 
      code: (error as any).code, 
      message: (error as any).message 
    });
  }
}
