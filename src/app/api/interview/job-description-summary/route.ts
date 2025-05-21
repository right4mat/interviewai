import { NextRequest, NextResponse } from "next/server";
import requireAuth from "../../_require-auth";
import { z } from "zod";
import { getOrCreateJobDescription } from "../../_app";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds

// Define schema for request validation
const JobDescriptionRequestSchema = z.object({
  jobDescription: z.string()
});

export const POST = requireAuth(async (req: NextRequest, user: any) => {
  try {
    const body = await req.json();

    // Validate request body
    const validatedBody = JobDescriptionRequestSchema.safeParse(body);
    if (!validatedBody.success) {
      return NextResponse.json(
        { status: "error", message: validatedBody.error.message },
        { status: 400 }
      );
    }

    const jobDescriptionContent = validatedBody.data.jobDescription;
    
    // Get or create job description
    const jobDescData = await getOrCreateJobDescription({
      userId: user.id,
      jobDescription: jobDescriptionContent,
    });

    // Return just the ID
    return NextResponse.json({
      status: "success",
      data: {
        id: jobDescData.id
      }
    });

  } catch (error: any) {
    console.error("job-description-summary error", error);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 400 }
    );
  }
});
