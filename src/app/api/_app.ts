import supabase from "./_supabase";
import { handle } from "./_db";
const crypto = require("crypto");

interface ResumeData {
  userId: string;
  resumeContent: string;
}

interface JobDescriptionData {
  userId: string;
  jobDescription: string;
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

async function createResume(data: ResumeData) {
  const { userId, resumeContent } = data;
  
  // Generate hash for the resume content
  const resumeHash = crypto.createHash("sha256").update(resumeContent).digest("hex");
  
  // Check if resume with this hash already exists for the user
  const existingResume = await supabase
    .from("resumes")
    .select("id")
    .eq("hash", resumeHash)
    .eq("user_id", userId)
    .single()
    .then(handle);
    
  if (existingResume) {
    return { id: existingResume.id };
  }
  
  // Insert new resume
  const newResume = await supabase
    .from("resumes")
    .insert([
      {
        user_id: userId,
        resume: resumeContent,
        hash: resumeHash
      }
    ])
    .select("id")
    .single()
    .then(handle);
  
  return { id: newResume.id };
}

async function getResume(id: number, userId: string) {
  return await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single()
    .then(handle);
}

async function getOrCreateJobDescription(data: JobDescriptionData) {
  const { userId, jobDescription } = data;
  
  // Generate hash for job description
  const jobDescriptionHash = crypto.createHash("sha256").update(jobDescription).digest("hex");

  // Get or create job description record
  let jobDescData = await supabase
    .from("job_descriptions")
    .select("id")
    .eq("hash", jobDescriptionHash)
    .eq("user_id", userId)
    .maybeSingle()
    .then(handle);

  if (!jobDescData) {
    jobDescData = await supabase
      .from("job_descriptions")
      .insert([
        {
          user_id: userId,
          job_description: jobDescription,
          hash: jobDescriptionHash
        }
      ])
      .select("id")
      .single()
      .then(handle);
  }

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
    .select("id",{ count: "exact", head: false })
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

export {
  createResume,
  getResume,
  getOrCreateJobDescription,
  createInterview,
  saveQuestionAnswers,
  findExistingInterview
};
