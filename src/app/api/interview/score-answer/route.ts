import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import requireAuth from "../../_require-auth";
import { z } from "zod";
import { getJobDescription, getResume } from "../../_app";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Define schema for request validation
const scoreAnswerSchema = z.object({
  jobDescriptionId: z.number().min(1, "Job description is required"),
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  type: z.string().optional().default("mixed"),
  difficulty: z.string().optional().default("intermediate"),
  resumeId: z.number().nullable().optional()
});

export const POST = requireAuth(async (req: NextRequest, user: any) => {
  try {
    const body = await req.json();

    // Validate request body
    const result = scoreAnswerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.format()
        },
        { status: 400 }
      );
    }

    const { question, answer, jobDescriptionId, type, difficulty, resumeId } = result.data;

    const [resume, jobDescription] = await Promise.all([
      resumeId ? getResume(resumeId, user.id) : undefined,
      getJobDescription(user.id, jobDescriptionId)
    ]);

    // Process everything in a single API call
    const evaluationPrompt = `
You are an interview evaluator. The interview is ${type} and the difficulty is ${difficulty}. You need to:



1. Clean up the transcribed answer from speech recognition:
"${answer}"

2. Summarize the interview question into a concise one-line description:
"${question}"

3. Evaluate how well the candidate answered the interview question.
Job Description: ${jobDescription}
${resume ? `Candidate's Resume: ${resume}` : ""}

4. Provide a model answer based on the candidate's response but improved to be a perfect 100% score answer.

Evaluate the answer based on:
- Relevance to the question
- Completeness
- Clarity
- Technical accuracy (if applicable)
- Examples provided (if applicable)
- Alignment with the job requirements in the job description

Provide your response as a valid JSON object with the following structure:
{
  "cleanedAnswer": [the cleaned up transcription with proper punctuation and formatting],
  "questionSummary": [a concise one-line description of the question],
  "score": [a single integer from 0 to 100],
  "reasoning": [brief explanation of your score in 50 words or less],
  "modelAnswer": [an improved version of the candidate's answer that would score 100%]
}

Do not include any text outside of this JSON object.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an interview evaluator that cleans transcriptions, summarizes questions, and scores answers. You always respond with valid JSON."
        },
        { role: "user", content: evaluationPrompt }
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const responseContent =
      response.choices[0].message.content?.trim() ||
      '{"cleanedAnswer": "", "questionSummary": "", "score": 0, "reasoning": "Unable to evaluate answer", "modelAnswer": ""}';

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch (e) {
      console.error("Failed to parse OpenAI response as JSON:", e);
      parsedResponse = {
        question: question,
        cleanedAnswer: answer,
        questionSummary: question,
        score: 0,
        reasoning: "Error parsing evaluation",
        modelAnswer: ""
      };
    }

    // Ensure score is within valid range
    const validScore = Math.min(Math.max(isNaN(parsedResponse.score) ? 0 : parsedResponse.score, 0), 100);

    return NextResponse.json({
      status: "success",
      data: {
        question: question,
        score: validScore,
        reasoning: parsedResponse.reasoning || "No reasoning provided",
        cleanedAnswer: parsedResponse.cleanedAnswer || answer,
        questionSummary: parsedResponse.questionSummary || question,
        modelAnswer: parsedResponse.modelAnswer || "No model answer provided"
      }
    });
  } catch (error) {
    console.error("Error scoring answer:", error);
    return NextResponse.json({ error: "Failed to score answer" }, { status: 500 });
  }
});
