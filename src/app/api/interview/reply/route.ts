import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import requireAuth from "../../_require-auth";
import { z } from "zod";
import { getJobDescription, getResume } from "../../_app";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Define schema for request validation
const replySchema = z.object({
  company: z.string(),
  jobDescriptionId: z.number().min(1, "Job description is required"),
  resumeId: z.number().or(z.null()).optional(),
  interviewers: z.object({
    name: z.string().min(1, "Interviewer name is required"),
    role: z.string().min(1, "Interviewer role is required")
  }),
  difficulty: z.string().optional().default("intermediate"),
  nextQuestion: z.string(),
  currentQuestion: z.string(),
  currentAnswer: z.string(),
  firstQuestion: z.string(),
  isFirstQuestion: z.boolean().optional().default(false),
  isLastAnswer: z.boolean().optional().default(false),
  type: z.string().optional().default("mixed")
});

export const POST = requireAuth(async (req: NextRequest, user: any) => {
  try {
    const body = await req.json();

    // Validate request body
    const result = replySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.format()
        },
        { status: 400 }
      );
    }

    const {
      company,
      jobDescriptionId,
      resumeId,
      interviewers,
      currentQuestion,
      currentAnswer,
      nextQuestion,
      firstQuestion,
      isFirstQuestion = false,
      isLastAnswer = false,
      type,
      difficulty
    } = result.data;

    const [resume, jobDescription] = await Promise.all([
      resumeId ? getResume(resumeId, user.id) : undefined,
      getJobDescription(user.id, jobDescriptionId)
    ]);

    let replyPrompt = `
You are ${interviewers.name}, a ${interviewers.role} conducting an interview.

Job Description: ${jobDescription}
${resume ? `Candidate's Resume: ${resume}` : ""}

The interview is ${type} and the difficulty is ${difficulty}.
`;

    if (isFirstQuestion) {
      replyPrompt += `
This is the start of the interview. Begin with a brief introduction of yourself as ${interviewers.name}${company ? ` from ${company}` : ""}, your role as ${interviewers.role}, and then ask the first question: "${firstQuestion}"

Keep your introduction professional but warm and welcoming.
`;
    } else if (isLastAnswer) {
      replyPrompt += `
The candidate was just asked: "${currentQuestion}"

The candidate's response was: "${currentAnswer}"

This is the end of the interview. Provide:
1. A brief, natural response to the candidate's final answer
2. A closing statement thanking them for their time
3. Information about next steps in the interview process
4. A professional sign-off

Keep your response conversational and professional. Respond as if you're speaking directly to the candidate.
`;
    } else {
      replyPrompt += `
The candidate was just asked: "${currentQuestion}"

The candidate's response was: "${currentAnswer}"

Provide a brief acknowledgment of their answer (1-2 sentences maximum), then transition naturally to asking: "${nextQuestion}"

Keep your response conversational and professional. Do not ask any follow-up questions - simply acknowledge their answer and move to the next question.
`;
    }

    // Generate text response
    const textResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI interviewer having a conversation with a job candidate. Keep responses brief and direct. Do not ask follow-up questions."
        },
        { role: "user", content: replyPrompt }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    const responseContent = textResponse?.choices?.[0]?.message?.content?.trim() || "";

    // Generate audio from the text response
    console.time('tts-1-generation');
    const audioResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: responseContent
    });
    console.timeEnd('tts-1-generation');

    // Get audio as buffer and convert to base64
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    const base64Audio = `data:audio/mpeg;base64,${audioBuffer.toString("base64")}`;

    // Return base64 encoded audio
    return NextResponse.json({
      status: "success",
      data: {
        audio: base64Audio,
        text: responseContent
      }
    });
  } catch (error) {
    console.error("Error generating interview reply:", error);
    return NextResponse.json({ error: "Failed to generate interview reply" }, { status: 500 });
  }
});
