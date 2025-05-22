import { NextRequest, NextResponse } from "next/server";
import requireAuth from "../../_require-auth";
import { z } from "zod";
import type { User } from "@supabase/supabase-js";
import { getResume, getOrCreateJobDescription, createInterview, saveQuestionAnswers, findExistingInterview } from "../../_app";

// Define schema for request validation
const getQuestionsSchema = z.object({
  questions: z.array(z.string()),
  currentQuestionIndex: z.number(),
  interviewer: z.object({
    name: z.string().min(1, "Interviewer name is required"),
    role: z.string().min(1, "Interviewer role is required")
  }),
  settings: z.object({
    difficulty: z.string().optional().default("intermediate"),
    type: z.string().optional().default("mixed")
  }),
  jobDescriptionId: z.number().min(1, "Job description is required"),
  resumeId: z.number().or(z.null()).optional(),
  questionAnswers: z.array(
    z.object({
      question: z.string(),
      score: z.number(),
      reasoning: z.string(),
      cleanedAnswer: z.string(),
      questionSummary: z.string(),
      modelAnswer: z.string(),
      answer: z.string()
    })
  )
});

export const POST = requireAuth(async (req: NextRequest, user: User) => {
  try {
    const body = await req.json();

    // Validate request body
    const result = getQuestionsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.format()
        },
        { status: 400 }
      );
    }

    const { jobDescriptionId, resumeId, questionAnswers, questions, interviewer, settings, currentQuestionIndex } = result.data;

  

    // Calculate total score
    const totalScore = questionAnswers.reduce((sum, qa) => sum + (qa.score || 0), 0);

    // Check if there's an existing interview that matches the criteria
    const existingInterview = await findExistingInterview({
      userId: user.id,
      jobDescriptionId: jobDescriptionId,
      resumeId: resumeId || null,
      settings: {
        difficulty: settings.difficulty,
        type: settings.type
      },
      interviewer: {
        name: interviewer.name,
        role: interviewer.role
      },
      questions
    });

    // Use existing interview or create a new one
    let interview;
    if (existingInterview) {
      interview = existingInterview;
    } else {
      interview = await createInterview({
        userId: user.id,
        jobDescriptionId: jobDescriptionId,
        resumeId: resumeId || null,
        settings: {
          difficulty: settings.difficulty,
          type: settings.type
        },
        interviewer: {
          name: interviewer.name,
          role: interviewer.role
        },
        questions
      });
    }

    // Save question answers
    await saveQuestionAnswers({
      userId: user.id,
      interviewId: interview.id,
      questionAnswers,
      totalScore,
      currentQuestionIndex
    });

    return NextResponse.json({
      status: "success",
      data: {}
    });
  } catch (error) {
    console.error("Error saving interview:", error);
    return NextResponse.json({ error: "Failed to save interview" }, { status: 500 });
  }
});
