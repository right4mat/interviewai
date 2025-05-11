import React from "react";
import SetupInterview from "@/blocks/app/interview/SetupInterview";
import Interview from "@/blocks/app/interview/Interview";
import { useInterviewStore } from "@/stores/interviewStore";

const InterviewStepper: React.FC = () => {
  const { interviewState: { stage } } = useInterviewStore();

  return <>{stage === "setup" ? <SetupInterview /> : <Interview />}</>;
};

export default InterviewStepper;
