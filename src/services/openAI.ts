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

  dc.onopen = () => {
    console.log("DataChannel open");
  
    // Send initial system prompt
    const event = {
      type: "session.update",
      session: {
        instructions: `You are an expert interviewer conducting an interview for this job description the candidate is ella and she is applying for the role of Photographer + Content Creator:
        Who is The Media Society?

The Media Society is a boutique creative marketing agency specialising in content creation, social media marketing, creative copy & design for established and emerging businesses and personal branding.
 
We're looking for a content-obsessed creative to join our growing team on a part-time basis (3 - 4 days per week). You'll be behind the camera (and occasionally in front), directing and producing content that not only looks amazing, but also performs for our diverse client base. 
 
As our Photographer + Content Creator, you will take full ownership of the content process – from concept to creation. This includes:
    •    Plan and create mood boards for client shoots, ensuring alignment with their brand and vision.
    •    Photograph & Film content using both professional cameras and iPhone on location, in-studio, and in-office for our clients and team. This includes directing talent, team members, and clients to bring the creative vision to life seamlessly.
    •    Edit and package content to be visually engaging, platform-specific, brand-aligned, and of high technical quality.
    •    Stay across social media trends, viral sounds, transitions, and formats – and know when and how to jump on them.
    •    Collaborate with our marketing team and bring your creative flair to overall social media strategies.  
    •    Apply content marketing principles to your work—understanding the "why" behind each video and tailoring content to educate, inspire, and ultimately convert viewers into customers. 
 
Our ideal candidate will:
    •    Be Brisbane-based. 
    •    Has 2+ years of experience in professional photography, content creation, videography, or social media marketing.
    •    Has strong skills in filming, editing (Adobe Premiere Pro, CapCut, or similar), and creating compelling content that tells a story.
    •    Have strong skills in photography, and editing (Lightroom, Photoshop).
    •    Have a deep understanding of Instagram and TikTok trends, transitions, and audience engagement.
    •    Be comfortable shooting for diverse industries, both on location, and in studio. 
    •    Love working with people, bringing life and energy to every shoot. 
    •    Thrives in a fast-paced environment, taking ownership of creative direction.
    •    Be reliable, proactive, and able to manage a consistent monthly content schedule.
 
Why work with TMS:
    •    You'll get to work with a dynamic, fun and vibrant team from our New Farm office, and on location.
    •    You'll get to work with some incredible people and businesses across a range of industries. 
    •    You'll get the opportunity to travel for exciting and adventurous shoots.
    •    We offer competitive salary and flexible working arrangements (days) for the right candidate.
    •    The opportunity to learn creative skills from our in-house content creation team.
    •    The opportunity to expand to a full-time position for the right candidate. 
    •    No weekend work!!!`
      },
    };
    
    dc.send(JSON.stringify(event));
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
