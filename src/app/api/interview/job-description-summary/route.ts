import { NextRequest, NextResponse } from "next/server";
import requireAuth from "../../_require-auth";
import { z } from "zod";
import { analyzeJobDescription, findExistingJobDescription, createJobDescription, updateInterview } from "../../_app";
const crypto = require("crypto");

export const maxDuration = 60; // This function can run for a maximum of 60 seconds

// Define schema for request validation
const JobDescriptionRequestSchema = z.object({
  jobDescription: z.string(),
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

    const { jobDescription: jobDescriptionContent } = validatedBody.data;
    
    // Generate hash for job description
    const jobDescriptionHash = crypto.createHash("sha256").update(jobDescriptionContent).digest("hex");

    // Check for existing job description
    const existingJobDesc = await findExistingJobDescription(user.id, jobDescriptionHash);
    if (existingJobDesc) {
      return NextResponse.json({
        status: "success",
        data: {
          id: existingJobDesc.id,
          company: existingJobDesc.company
        }
      });
    }

    // Analyze job description using AI
    const analysis = await analyzeJobDescription(jobDescriptionContent);

    // Create new job description record
    const jobDescData = await createJobDescription(user.id, jobDescriptionHash, analysis.summary, analysis.company);

   

    // Return just the ID
    return NextResponse.json({
      status: "success",
      data: {
        id: jobDescData.id,
        company: analysis.company
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
