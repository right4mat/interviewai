import React from "react";
import SetupInterview from "@/blocks/interview/SetupInterview";
import Interview from "./Interview";
import { useInterviewStore } from "@/stores/interviewStore";

const InterviewStepper: React.FC = () => {
  const { stage } = useInterviewStore();

  return <>{stage === "setup" ? <SetupInterview /> : <Interview />}</>;
};

export default InterviewStepper;
