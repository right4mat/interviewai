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
  difficulty: z.string().optional().default("intermediate"),
  type: z.string().optional().default("mixed"),
  questionAnswers: z.array(z.object({
    question: z.string(),
    score: z.number().optional(),
    reasoning: z.string().optional(), 
    cleanedAnswer: z.string().optional(),
  }))
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

    const { jobDescription, questionAnswers } = result.data;

    const totalScore = questionAnswers.reduce((sum, qa) => sum + (qa.score || 0), 0);
    const averageScore = totalScore / questionAnswers.length;

    const reviewPrompt = `
Please provide a critical review (max 200 words) of this interview performance.

Job Description: ${jobDescription}

Questions and Answers:
${questionAnswers.map(qa => `
Question: ${qa.question}
Answer: ${qa.cleanedAnswer || 'No answer provided'}
Score: ${qa.score || 0}/100
Feedback: ${qa.reasoning || 'No feedback provided'}`).join('\n')}

Average Score: ${averageScore}/100

Provide a balanced review that:
- Evaluates overall performance
- Highlights key strengths
- Identifies areas for improvement
- Considers alignment with the job requirements
- Makes specific recommendations
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert interviewer who provides balanced, constructive interview feedback." },
        { role: "user", content: reviewPrompt }
      ],
      temperature: 0.7,
      max_tokens: 400
    });

    const review = response.choices[0].message.content?.trim() || '';
    
    return NextResponse.json({ 
      status: "success",
      data: {
        review,
        averageScore: averageScore || 0,
        totalScore: totalScore || 0,
      }
    });
  } catch (error) {
    console.error("Error generating interview review:", error);
    return NextResponse.json({ error: "Failed to generate interview review" }, { status: 500 });
  }
});
