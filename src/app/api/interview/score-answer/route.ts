import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import requireAuth from "../../_require-auth";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Define schema for request validation
const scoreAnswerSchema = z.object({
  jobDescription: z.string().min(1, "Job description is required"),
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required")
});

export const POST = requireAuth(async (req: NextRequest, user: any) => {
  try {
    const body = await req.json();
    
    // Validate request body
    const result = scoreAnswerSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: result.error.format() 
      }, { status: 400 });
    }

    const { question, answer, jobDescription } = result.data;

    const prompt = `
You are an interview evaluator. You need to score how well the candidate answered the interview question.
Job Description: ${jobDescription}
Question: ${question}
Answer: ${answer}

Evaluate the answer based on:
- Relevance to the question
- Completeness
- Clarity
- Technical accuracy (if applicable)
- Examples provided (if applicable)
- Alignment with the job requirements in the job description

Provide only a single integer score from 0 to 100. Do not include any explanation or additional text.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an interview evaluator that scores answers on a scale of 0-100." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 10
    });

    const scoreText = response.choices[0].message.content?.trim() || "0";
    const score = parseInt(scoreText.replace(/\D/g, ""));

    // Ensure score is within valid range
    const validScore = Math.min(Math.max(isNaN(score) ? 0 : score, 0), 100);

    return NextResponse.json({ score: validScore });
  } catch (error) {
    console.error("Error scoring answer:", error);
    return NextResponse.json({ error: "Failed to score answer" }, { status: 500 });
  }
});
