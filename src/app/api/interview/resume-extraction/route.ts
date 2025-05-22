import { NextRequest, NextResponse } from "next/server";
import requireAuth from "../../_require-auth";
import openai from "../../_openAI";
import { z } from "zod";
import { upsertResume } from "../../_app";
import crypto from "crypto";
import supabase from "../../_supabase";
import { handle } from "../../_db";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds

// Define schema for request validation
const ResumeRequestSchema = z.object({
  resumeImageArray: z.array(z.string()),
  filename: z.string().optional()
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

    // Generate a hash from the resume images array
    const resumeImagesContent = validatedBody.data.resumeImageArray.join('');
    const resumeHash = crypto.createHash("sha256").update(resumeImagesContent).digest("hex");
    
    // Check if a resume with this exact hash exists for this user
    const existingResume = await supabase
      .from("resumes")
      .select("id, resume")
      .eq("hash", resumeHash)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(handle);
    
    // If we already have this exact resume, set current to true and return the existing ID
    if (existingResume) {
      await supabase
        .from("resumes")
        .update({ current: true })
        .eq("id", existingResume.id);

      return NextResponse.json({
        status: "success",
        data: {
          resumeId: existingResume.id
        }
      });
    }

    // If resume doesn't exist with this hash, call OpenAI API to extract resume data
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

    // Upsert resume to database with filename and hash
    const { id: resumeId } = await upsertResume({
      userId: user.id,
      resumeContent: content,
      filename: validatedBody.data.filename,
      hash: resumeHash
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
