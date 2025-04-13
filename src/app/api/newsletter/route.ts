import { NextRequest, NextResponse } from "next/server";
import Mailchimp from "mailchimp-api-v3";

const mailchimpClient = process.env.MAILCHIMP_API_KEY ? new Mailchimp(process.env.MAILCHIMP_API_KEY as string) : null;
const audienceId = process.env.MAILCHIMP_AUDIENCE_ID as string;

interface NewsletterRequestBody {
  email: string;
}

interface MailchimpError {
  title?: string;
  [key: string]: any;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as NewsletterRequestBody;

  try {
    if (audienceId && mailchimpClient) {
      await mailchimpClient.request({
        method: "POST",
        path: "/lists/" + audienceId + "/members",
        body: {
          email_address: body.email,
          // Set status to "subscribed" to disable double-opt-in
          status: "pending"
        }
      });
    } else {
      throw new Error("Mailchimp client not found");
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.log("newsletter error", error);

    // If error due to email already in list then return success response
    // rather than an error (the user doesn't need to know).
    if ((error as MailchimpError).title === "Member Exists") {
      return NextResponse.json({ status: "success" });
    }

    return NextResponse.json({ status: "error" });
  }
}
