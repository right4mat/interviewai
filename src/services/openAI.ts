import { useMutation } from '@tanstack/react-query';
import { apiRequest } from "@/utils/util";


// Initialize WebRTC connection with OpenAI
export async function initOpenAIRealtime() {
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
    if (pc.connectionState === 'closed' || pc.connectionState === 'failed') {
      audioEl.remove();
    }
  };

  pc.ontrack = e => {
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
  
  dc.addEventListener("message", messageHandler);

  // Start the session using the Session Description Protocol (SDP)
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  const baseUrl = "https://api.openai.com/v1/realtime";
  const model = "gpt-4o-realtime-preview-2024-12-17";
  const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
    method: "POST",
    body: offer.sdp,
    headers: {
      Authorization: `Bearer ${EPHEMERAL_KEY}`,
      "Content-Type": "application/sdp"
    },
  });

  const answer = {
    type: "answer" as const,
    sdp: await sdpResponse.text(),
  };
  await pc.setRemoteDescription(answer);
  
  return { pc, dc, cleanup: () => {
    dc.removeEventListener("message", messageHandler);
    pc.close();
    audioEl.remove();
  }};
}

// Hook to use OpenAI Realtime
export function useOpenAIRealtime() {
  return useMutation({
    mutationFn: async () => {
      console.log("initOpenAIRealtime");
      return initOpenAIRealtime();
    }
  });
}
