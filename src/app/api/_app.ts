import supabase from "./_supabase";
import { handle } from "./_db";
import openai from "./_openAI";
const crypto = require("crypto");

interface ResumeData {
  userId: string;
  resumeContent: string;
  filename?: string;
  hash?: string;
}

interface JobDescriptionData {
  userId: string;
  jobDescription: string;
  summarizedJobDescription?: string;
}

interface InterviewData {
  userId: string;
  jobDescriptionId: number;
  resumeId: number | null;
  settings: {
    difficulty: string;
    type: string;
  };
  interviewer: {
    name: string;
    role: string;
  };
  questions: string[];
}

interface QuestionAnswerData {
  userId: string;
  interviewId: number;
  questionAnswers: Array<{
    question: string;
    score: number;
    reasoning: string;
    cleanedAnswer: string;
    questionSummary: string;
    modelAnswer: string;
    answer: string;
  }>;
  totalScore: number;
  currentQuestionIndex: number;
}

async function upsertResume(data: ResumeData) {
  const { userId, resumeContent, filename, hash } = data;
  
  const resumeHash = hash;
  
  // Use Supabase upsert to insert or update based on user_id
  const { data: resumeData, error } = await supabase
    .from("resumes")
    .upsert(
      {
        user_id: userId,
        resume: resumeContent,
        hash: resumeHash,
        filename: filename,
      },
      {
        onConflict: 'user_id'
      }
    )
    .select('id')
    .single();
  
  if (error) {
    throw error;
  }
  
  return { id: resumeData.id };
}

async function getResume(id: number, userId: string) {
  return await supabase.from("resumes").select("*").eq("id", id).eq("user_id", userId).single().then(handle);
}

async function getOrCreateJobDescription(data: JobDescriptionData) {
  const { userId, jobDescription } = data;

  // Generate hash for job description from the unsummarized version
  const jobDescriptionHash = crypto.createHash("sha256").update(jobDescription).digest("hex");

  // Get or create job description record
  let jobDescData = await supabase
    .from("job_descriptions")
    .select("*")
    .eq("hash", jobDescriptionHash)
    .eq("user_id", userId)
    .maybeSingle()
    .then(handle);

  if (jobDescData) {
    return jobDescData;
  }

  // If no existing summary, generate one using OpenAI
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    max_tokens: 300,
    messages: [
      {
        role: "system",
        content: "You are a specialized assistant that summarizes job descriptions concisely."
      },
      {
        role: "user",
        content: `Please summarize this job description in 200 words or less, focusing on the key requirements, responsibilities, and qualifications the employer is looking for. Emphasize the most important skills and experiences needed for this role:\n\n${jobDescription}`
      }
    ]
  });

  const summary = response?.choices[0]?.message?.content?.trim();
  if (!summary) {
    throw new Error("Failed to summarize the job description");
  }

  // Create new job description record with the summary
  jobDescData = await supabase
    .from("job_descriptions")
    .insert([
      {
        user_id: userId,
        job_description: summary,
        hash: jobDescriptionHash
      }
    ])
    .select("*")
    .single()
    .then(handle);

  return jobDescData;
}

async function findExistingInterview(data: {
  userId: string;
  jobDescriptionId: number;
  resumeId: number | null;
  settings: {
    difficulty: string;
    type: string;
  };
  interviewer: {
    name: string;
    role: string;
  };
  questions: string[];
}) {
  const { userId, jobDescriptionId, resumeId, settings, interviewer, questions } = data;

  // Check for an existing interview that matches the criteria
  let query = supabase
    .from("interviews")
    .select("id", { count: "exact", head: false })
    .limit(1)
    .eq("user_id", userId)
    .eq("job_description_id", jobDescriptionId)
    .eq("settings->>difficulty", settings.difficulty)
    .eq("settings->>type", settings.type)
    .eq("interviewer->>name", interviewer.name)
    .eq("interviewer->>role", interviewer.role)
    .filter("questions", "cs", JSON.stringify(questions));

  // Adjust query based on whether resumeId is null
  if (resumeId === null) {
    query = query.is("resume_id", null);
  } else {
    query = query.eq("resume_id", resumeId);
  }

  const existingInterview = await query.maybeSingle().then(handle);

  return existingInterview ? { id: existingInterview.id } : null;
}

async function createInterview(data: InterviewData) {
  const { userId, jobDescriptionId, resumeId, settings, interviewer, questions } = data;

  // Store interview record
  const interview = await supabase
    .from("interviews")
    .insert([
      {
        user_id: userId,
        job_description_id: jobDescriptionId,
        resume_id: resumeId,
        settings: {
          difficulty: settings.difficulty,
          type: settings.type
        },
        interviewer: {
          name: interviewer.name,
          role: interviewer.role
        },
        questions: questions
      }
    ])
    .select("id")
    .single()
    .then(handle);

  return interview;
}

async function saveQuestionAnswers(data: QuestionAnswerData) {
  const { userId, interviewId, questionAnswers, totalScore, currentQuestionIndex } = data;

  // Store question answers
  return await supabase
    .from("question_answers")
    .insert([
      {
        interview_id: interviewId,
        user_id: userId,
        question_answers: questionAnswers,
        score: totalScore,
        current_question_index: currentQuestionIndex
      }
    ])
    .then(handle);
}

async function getJobDescription(userId: string, jobDescriptionId: number) {
  return await supabase
    .from("job_descriptions")
    .select("*")
    .eq("id", jobDescriptionId)
    .eq("user_id", userId)
    .single()
    .then(handle);
}

export { upsertResume, getResume, getOrCreateJobDescription, createInterview, saveQuestionAnswers, findExistingInterview, getJobDescription };
