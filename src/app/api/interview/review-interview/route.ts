import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import requireAuth from "../../_require-auth";
import { z } from "zod";
import { getJobDescription, getResume } from "../../_app";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Define schema for request validation
const getQuestionsSchema = z.object({
  jobDescriptionId: z.number().min(1, "Job description is required"),
  resumeId: z.number().optional(),
  interviewers: z.object({
    name: z.string().min(1, "Interviewer name is required"),
    role: z.string().min(1, "Interviewer role is required")
  }),
  difficulty: z.string().optional().default("intermediate"),
  type: z.string().optional().default("mixed"),
  questionAnswers: z.array(z.object({
    question: z.string(),
    score: z.number(),
    reasoning: z.string(), 
    cleanedAnswer: z.string(),
    answer: z.string(),
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

    const { jobDescriptionId, questionAnswers, resumeId } = result.data;

    const [resume, jobDescription] = await Promise.all([
      resumeId ? getResume(resumeId, user.id) : undefined,
      getJobDescription(user.id, jobDescriptionId)
    ]);

    const totalScore = questionAnswers.reduce((sum, qa) => sum + (qa.score || 0), 0);
    const averageScore = totalScore / questionAnswers.length;

    const reviewPrompt = `
You are conducting a review of an interview performance. Please provide a clear, concise, and constructive review that is easy to read.

Context:
- Job Description: ${jobDescription}
${resume ? `- Candidate's Resume: ${resume.resume}` : ''}
- Average Score: ${averageScore}/100

Interview Questions and Responses:
${questionAnswers.map(qa => `
- Question: ${qa.question}
- Answer: ${qa.cleanedAnswer || 'No answer provided'}
- Score: ${qa.score}/100
- Feedback: ${qa.reasoning || 'No feedback provided'}`).join('\n')}

Please provide:
1. A probability score between 0 and 1 (e.g., 0.75) representing how likely the candidate is to get this job based on their interview performance
2. A concise review (maximum 200 words) that covers:
   - Overall performance assessment
   - Notable strengths
   - Key areas for improvement
   - Specific actionable recommendations

Format your response as a JSON object with two fields:
{
  "gotJobProb": "0.XX",
  "review": "Your concise review here..."
}

Keep the review professional, constructive, and focused on helping the candidate improve.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are an expert interviewer providing clear, concise, and constructive feedback. Write in a professional but conversational tone, focusing on actionable insights. Keep responses clear and well-structured without excessive formatting. Always return a valid JSON object with 'gotJobProb' (0-1 value as string) and 'review' (200 words max) fields." 
        },
        { role: "user", content: reviewPrompt }
      ],
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    const reviewData = JSON.parse(response?.choices?.[0]?.message?.content?.trim() || '{"gotJobProb": "0", "review": "Failed to generate review"}');
    
    return NextResponse.json({ 
      status: "success",
      data: {
        review: reviewData.review,
        gotJobProb: parseFloat(reviewData.gotJobProb),
        averageScore: averageScore || 0,
        totalScore: totalScore || 0,
      }
    });
  } catch (error) {
    console.error("Error generating interview review:", error);
    return NextResponse.json({ error: "Failed to generate interview review" }, { status: 500 });
  }
});
