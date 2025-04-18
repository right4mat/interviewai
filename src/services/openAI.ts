import { apiRequest } from "@/utils/util";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Interviewer } from "@/types/interview";

interface ScoreAnswerResponse {
  score: number;
  reasoning: string;
  cleanedAnswer: string;
  questionSummary: string;
  modelAnswer: string;
}

interface ScoreAnswerRequest {
  question: string;
  answer: string;
  jobDescription: string;
}

interface GetQuestionsRequest {
  jobDescription: string;
  resume: string;
  interviewers: Interviewer;
  difficulty: string;
}

type GetQuestionsResponse = string;

export const useScoreAnswer = () => {
  return useMutation<ScoreAnswerResponse, Error, ScoreAnswerRequest>({
    mutationFn: async ({ question, answer, jobDescription }) => {
      const response = await apiRequest("interview/score-answer", "POST", {
        question,
        answer,
        jobDescription
      });

      return response;
    }
  });
};

export const useGetInterviewQuestions = (params: GetQuestionsRequest) => {
  return useQuery<GetQuestionsResponse, Error>({
    queryKey: ["interviewQuestions", params],
    queryFn: async () => {
      const response = await apiRequest("interview/get-questions", "POST", params);
      return response;
    }
  });
};

// Initialize WebRTC connection with OpenAI
export async function initOpenAIRealtime({
  jobDescription,
  interviewers,
  questions
}: {
  jobDescription: string;
  interviewers: Interviewer;
  questions?: string;
}) {
  // Get an ephemeral key from your server
  const tokenResponse = await apiRequest("open-ai/session", "GET");
  const EPHEMERAL_KEY = tokenResponse.client_secret.value;

  // Create a peer connection
  const pc = new RTCPeerConnection();

  // Set up to play remote audio from the model
  const audioEl = document.createElement("audio");
  audioEl.autoplay = true;
  audioEl.id = "openai-audio-output"; // Add unique ID

  // Remove any existing audio element
  const existingAudio = document.getElementById("openai-audio-output");
  if (existingAudio) {
    existingAudio.remove();
  }

  document.body.appendChild(audioEl);

  // Clean up audio element when connection closes
  pc.onconnectionstatechange = () => {
    if (pc.connectionState === "closed" || pc.connectionState === "failed") {
      audioEl.remove();
    }
  };

  pc.ontrack = (e) => {
    if (audioEl.srcObject !== e.streams[0]) {
      audioEl.srcObject = e.streams[0];
    }
  };

  // Add local audio track for microphone input in the browser
  const ms = await navigator.mediaDevices.getUserMedia({
    audio: true
  });
  pc.addTrack(ms.getTracks()[0]);

  // Set up data channel for sending and receiving events
  const dc = pc.createDataChannel("oai-events");

  // Store the message handler so we can remove it later
  const messageHandler = (e: MessageEvent) => {
    console.log(e);
  };

  dc.onopen = () => {
    console.log("DataChannel open");

    // Send initial system prompt with job description and interviewers
    const event = {
      type: "session.update",
      session: {
        instructions: `You are an expert interviewer conducting an interview for this job description:

${jobDescription}

The interview panel consists of:
${interviewers.name} (${interviewers.role})

Here are the questions you should ask during the interview:
${questions}

Please conduct a professional interview following these guidelines:
1. Start with a brief introduction of yourself and the interview panel
2. Ask the questions provided above based on the job description
3. Maintain a professional and engaging conversation
4. Allow the candidate to ask questions at the end
5. Conclude the interview appropriately`
      }
    };

    dc.send(JSON.stringify(event));
  };

  dc.addEventListener("message", messageHandler);

  // Start the session using the Session Description Protocol (SDP)
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  const baseUrl = "https://api.openai.com/v1/realtime";
  const model = "gpt-4o-mini";
  const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
    method: "POST",
    body: offer.sdp,
    headers: {
      Authorization: `Bearer ${EPHEMERAL_KEY}`,
      "Content-Type": "application/sdp"
    }
  });

  const answer = {
    type: "answer" as const,
    sdp: await sdpResponse.text()
  };
  await pc.setRemoteDescription(answer);

  return {
    pc,
    dc,
    cleanup: () => {
      dc.removeEventListener("message", messageHandler);
      pc.close();
      audioEl.remove();
    }
  };
}
