"use client";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Webcam from "react-webcam";
import { initOpenAIRealtime } from "@/services/openAI";
import VideoDisplay from "./VideoDisplay";
import ParticipantsList from "./ParticipantsList";

export default function MainGrid(): React.ReactElement {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [participants, setParticipants] = useState<string[]>([
    "John Doe",
    "Jane Smith",
    "Robert Johnson",
    "Emily Davis",
    "Michael Wilson"
  ]);
  const webcamRef = useRef<Webcam>(null);
  const [rtcConnection, setRtcConnection] = useState<{ pc: RTCPeerConnection, dc: RTCDataChannel, cleanup: () => void } | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Initialize OpenAI Realtime connection when component mounts
    if (!rtcConnection && !isConnecting) {
      setIsConnecting(true);
      initOpenAIRealtime()
        .then((connection) => {
          setRtcConnection(connection);
          setIsConnected(true);
          setIsConnecting(false);
          console.log("OpenAI Realtime connection established");
        })
        .catch((error) => {
          console.error("Failed to connect to OpenAI Realtime:", error);
          setIsConnecting(false);
        });
    }

    // Cleanup function to close connection when component unmounts
    return () => {
      if (rtcConnection) {
        rtcConnection.cleanup();
        console.log("OpenAI Realtime connection closed");
      }
    };
  }, [rtcConnection, isConnecting]);

  const toggleMute = (): void => {
    setIsMuted(!isMuted);
    if (rtcConnection) {
      // Update audio track enabled state
      rtcConnection.pc.getSenders().forEach(sender => {
        if (sender.track && sender.track.kind === 'audio') {
          sender.track.enabled = isMuted; // Toggle from current state
        }
      });
    }
  };

  const toggleVideo = (): void => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleScreenShare = (): void => {
    setIsScreenSharing(!isScreenSharing);
  };

  const toggleChat = (): void => {
    setIsChatOpen(!isChatOpen);
  };

  const endCall = (): void => {
    if (rtcConnection) {
      rtcConnection.cleanup();
      setRtcConnection(null);
      setIsConnected(false);
      setIsConnecting(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h5" sx={{ mb: 4 }}>
        {isConnected ? "AI Interview Session" : "Starting Interview..."}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <VideoDisplay
            isMuted={isMuted}
            isVideoOn={isVideoOn}
            isScreenSharing={isScreenSharing}
            isChatOpen={isChatOpen}
            isConnecting={isConnecting}
            isConnected={isConnected}
            participantName={participants[0]}
            webcamRef={webcamRef as React.RefObject<Webcam>}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onToggleScreenShare={toggleScreenShare}
            onToggleChat={toggleChat}
            onEndCall={endCall}
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <ParticipantsList participants={participants} />
        </Grid>
      </Grid>
    </Box>
  );
}
