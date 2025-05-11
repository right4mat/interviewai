import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import requireAuth from "../../_require-auth";
import { z } from "zod";
import supabase from "../../_supabase";
import { User } from "@supabase/supabase-js";
const crypto = require('crypto');

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
    type: z.string().optional().default("mixed"),
  }),
  jobDescription: z.string().min(1, "Job description is required"),
  resume: z.string().optional(),
  questionAnswers: z.array(z.object({
    question: z.string(),
    score: z.number().optional(),
    reasoning: z.string().optional(), 
    cleanedAnswer: z.string().optional(),
  }))
});

export const POST = requireAuth(async (req: NextRequest, user: User) => {
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

    const { jobDescription, resume, questionAnswers } = result.data;

    // Generate hashes
    const jobDescriptionHash = crypto.createHash('sha256').update(jobDescription).digest('hex');
    const resumeHash = resume ? crypto.createHash('sha256').update(resume).digest('hex') : null;

    // Get or create job description record
    let { data: jobDescData } = await supabase
      .from('job_descriptions')
      .select('id')
      .eq('hash', jobDescriptionHash)
      .eq('user_id', user.id)
      .single();

    if (!jobDescData) {
      const { data: newJobDesc, error: jobDescError } = await supabase
        .from('job_descriptions')
        .insert([{ 
          user_id: user.id,
          job_description: jobDescription,
          hash: jobDescriptionHash
        }])
        .select('id')
        .single();

      if (jobDescError) throw jobDescError;
      jobDescData = newJobDesc;
    }

    // Get or create resume record if resume exists
    let resumeData = null;
    if (resume) {
      let { data: existingResume } = await supabase
        .from('resumes')
        .select('id')
        .eq('hash', resumeHash)
        .eq('user_id', user.id)
        .single();

      if (!existingResume) {
        const { data: newResume, error: resumeError } = await supabase
          .from('resumes')
          .insert([{
            user_id: user.id,
            resume: resume,
            hash: resumeHash
          }])
          .select('id')
          .single();

        if (resumeError) throw resumeError;
        resumeData = newResume;
      } else {
        resumeData = existingResume;
      }
    }

    // Calculate scores
    const totalScore = questionAnswers.reduce((sum, qa) => sum + (qa.score || 0), 0);

    // Store interview record
    const { data: interview, error: interviewError } = await supabase
      .from('interviews')
      .insert([{
        user_id: user.id,
        job_description_id: jobDescData.id,
        resume_id: resumeData?.id || null,        
        settings: {
          difficulty: result.data.settings.difficulty,
          type: result.data.settings.type,
        },
        interviewer: {
          name: result.data.interviewer.name,
          role: result.data.interviewer.role,
        },
        questions: result.data.questions,
      }])
      .select('id')
      .single();

    if (interviewError) throw interviewError;

    // Store question answers
    const { error: answersError } = await supabase
      .from('question_answers')
      .insert([{
        interview_id: interview.id,
        user_id: user.id,
        question_answers: questionAnswers,
        score: totalScore,
        current_question_index: result.data.currentQuestionIndex
      }]);

    if (answersError) throw answersError;

    return NextResponse.json({ 
      status: "success",
      data:{}
    });

  } catch (error) {
    console.error("Error saving interview:", error);
    return NextResponse.json({ error: "Failed to save interview" }, { status: 500 });
  }
});
