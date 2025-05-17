export interface InterviewListResponse {
  id: number;
  company: string;
  job_description_id: number;
  resume_id: number | null;
  settings: {
    type: "technical" | "behavioral" | "mixed";
    difficulty: "beginner" | "intermediate" | "advanced";
  };
  interviewer: {
    name: string;
    role: string;
  };
  count: number;
  avg: number;
  created_at: string;
}

export type TrendType = "up" | "down" | "neutral";

export interface StatCardProps {
  title: string;
  value: string;
  interval: string;
  trend: TrendType;
  data?: number[];
  color: string;
} 