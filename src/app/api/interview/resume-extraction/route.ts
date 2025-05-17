import { NextRequest, NextResponse } from "next/server";
import requireAuth from "../../_require-auth";
import openai from "../../_openAI";
import { z } from "zod";
import { createResume } from "../../_app";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds

// Define schema for request validation
const ResumeRequestSchema = z.object({
  resumeImageArray: z.array(z.string())
});

export const POST = requireAuth(async (req: NextRequest, user: any) => {
  try {
    const body = await req.json();

    // Validate request body
    const validatedBody = ResumeRequestSchema.safeParse(body);
    if (!validatedBody.success) {
      return NextResponse.json(
        { status: "error", message: validatedBody.error.message },
        { status: 400 }
      );
    }

    // Call OpenAI API to extract resume data
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: "You are a specialized assistant that extracts key information from resumes."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Please analyze this resume and provide a brief summary of the key information in bullet points, including:
              - Name and contact details
              - Professional summary/objective
              - Key skills and technologies
              - Work experience highlights
              - Education details
              - Notable achievements/certifications
              Please be concise and focus on the most relevant information.`
            },
                   //@ts-ignore
            ...(validatedBody.data.resumeImageArray.map(image => ({
              type: "image_url",
              image_url: {
                url: image
              }
            })))
          ]
        }
      ]
    });

    const content = response?.choices[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json(
        { status: "error", message: "Failed to extract data from the resume" },
        { status: 400 }
      );
    }

    // Save resume to database using the createResume function
    const { id: resumeId } = await createResume({
      userId: user.id,
      resumeContent: content
    });

    // Return only the resume row ID
    return NextResponse.json({
      status: "success",
      data: {
        resumeId
      }
    });

  } catch (error: any) {
    console.error("resume-extraction error", error);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 400 }
    );
  }
});
