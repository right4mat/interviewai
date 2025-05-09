import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import requireAuth from "../../_require-auth";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Define schema for request validation
const getQuestionsSchema = z.object({
  jobDescription: z.string().min(1, "Job description is required"),
  resume: z.string().optional(),
  interviewers: z.object({
    name: z.string().min(1, "Interviewer name is required"),
    role: z.string().min(1, "Interviewer role is required")
  }),
  difficulty: z.string().optional().default("intermediate")
});

export const POST = requireAuth(async (req: NextRequest, user: any) => {
  try {
    const body = await req.json();
    
    // Validate request body
    const result = getQuestionsSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: result.error.format() 
      }, { status: 400 });
    }

    const { jobDescription, resume = "", interviewers, difficulty = "intermediate" } = result.data;

    const questionsPrompt = `
Generate a list of interview questions for a 30-minute interview.

Job Description: ${jobDescription}

${resume ? `Candidate's Resume: ${resume}` : ""}

Interviewer: ${interviewers.name} (${interviewers.role})

Difficulty Level: ${difficulty}

Please create a comprehensive set of questions that:
- Are appropriate for the specified difficulty level
- Assess the candidate's fit for the role based on the job description
- ${resume ? "Consider the candidate's background from their resume" : ""}
- Include a mix of behavioral, technical, and role-specific questions
- Can be reasonably answered within a 30-minute interview (typically 8-12 questions)
- Progress in a logical order from introductory to more complex topics

Return the questions as a numbered list (1. 2. 3. etc.) without any additional formatting or JSON structure.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert interview question generator who creates tailored questions based on job descriptions and candidate resumes." },
        { role: "user", content: questionsPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const responseContent = response.choices[0].message.content?.trim() || '';
    
    return NextResponse.json({ 
      status: "success", 
      data: responseContent 
    });
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return NextResponse.json({ error: "Failed to generate interview questions" }, { status: 500 });
  }
});
