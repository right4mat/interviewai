import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import requireAuth from "../../_require-auth";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Define schema for request validation
const replySchema = z.object({
  jobDescription: z.string().min(1, "Job description is required"),
  resume: z.string().optional(),
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
  isLastAnswer: z.boolean().optional().default(false)
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
      jobDescription,
      resume = "",
      interviewers,
      currentQuestion,
      currentAnswer,
      nextQuestion,
      firstQuestion,
      isFirstQuestion = false,
      isLastAnswer = false
    } = result.data;

    // Extract company name from job description (simple extraction)
    const companyMatch = jobDescription.match(
      /(?:at|for|with)\s+([A-Z][A-Za-z0-9\s]+?)(?:\.|\,|\s+is|\s+are|\s+we|\s+I|\s+in|\s+to|\s+and|\s+seeking|\s+looking|\s+hiring|$)/
    );
    const companyName = companyMatch ? companyMatch[1].trim() : "our company";

    let replyPrompt = `
You are ${interviewers.name}, a ${interviewers.role} conducting an interview.

Job Description: ${jobDescription}
${resume ? `Candidate's Resume: ${resume}` : ""}
`;

    if (isFirstQuestion) {
      replyPrompt += `
This is the start of the interview. Begin with a brief introduction of yourself as ${interviewers.name} from ${companyName}, your role as ${interviewers.role}, and then ask the first question: "${firstQuestion}"

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

    const responseContent = textResponse.choices[0].message.content?.trim() || "";

    // Generate audio from the text response
    const audioResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: responseContent
    });

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
