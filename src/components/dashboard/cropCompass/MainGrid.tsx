"use client";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import CallEndIcon from "@mui/icons-material/CallEnd";
import PeopleIcon from "@mui/icons-material/People";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Webcam from "react-webcam";
import { useOpenAIRealtime } from "@/services/openAI";

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
  const { mutate: initRealtime, isPending: isConnecting, isSuccess: isConnected } = useOpenAIRealtime();
  const [rtcConnection, setRtcConnection] = useState<{ pc: RTCPeerConnection, dc: RTCDataChannel, cleanup: () => void } | null>(null);
  const [isRealtimeCalled, setIsRealtimeCalled] = useState<boolean>(false);

  useEffect(() => {
    // Initialize OpenAI Realtime connection when component mounts
    if (!rtcConnection && !isRealtimeCalled) {
      setIsRealtimeCalled(true);
      initRealtime(undefined, {
        onSuccess: (connection) => {
          setRtcConnection(connection);
          console.log("OpenAI Realtime connection established");
        },
        onError: (error) => {
          console.error("Failed to connect to OpenAI Realtime:", error);
        }
      });
    }

    // Cleanup function to close connection when component unmounts
    return () => {
      if (rtcConnection) {
        rtcConnection.cleanup();
        console.log("OpenAI Realtime connection closed");
      }
    };
  }, []); // Empty dependency array to ensure it only runs once on mount

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
      rtcConnection.pc.close();
      setRtcConnection(null);
    }
    alert("Call ended");
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h5" sx={{ mb: 4 }}>
        {isConnected ? "AI Interview Session" : "Starting Interview..."}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 9 }}>
          <Card 
            variant="outlined"
            sx={{ 
              height: "70vh", 
              display: "flex", 
              flexDirection: "column",
              position: "relative",
              bgcolor: "#000"
            }}
          >
            {isVideoOn ? (
              <Webcam
                ref={webcamRef}
                audio={!isMuted}
                muted={true}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                screenshotFormat="image/jpeg"
              />
            ) : (
              <Box 
                sx={{ 
                  width: "100%", 
                  height: "100%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  bgcolor: "#333"
                }}
              >
                <Avatar 
                  sx={{ width: 120, height: 120, fontSize: "3rem" }}
                >
                  {participants[0].charAt(0)}
                </Avatar>
              </Box>
            )}
            
            <Box 
              sx={{ 
                position: "absolute", 
                bottom: 20, 
                left: "50%", 
                transform: "translateX(-50%)",
                display: "flex",
                gap: 2,
                bgcolor: "rgba(0,0,0,0.5)",
                borderRadius: 4,
                padding: 1
              }}
            >
              <IconButton 
                onClick={toggleMute} 
                sx={{ 
                  bgcolor: isMuted ? "error.main" : "rgba(255,255,255,0.2)",
                  color: "white",
                  "&:hover": { bgcolor: isMuted ? "error.dark" : "rgba(255,255,255,0.3)" }
                }}
              >
                {isMuted ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
              
              <IconButton 
                onClick={toggleVideo}
                sx={{ 
                  bgcolor: !isVideoOn ? "error.main" : "rgba(255,255,255,0.2)",
                  color: "white",
                  "&:hover": { bgcolor: !isVideoOn ? "error.dark" : "rgba(255,255,255,0.3)" }
                }}
              >
                {isVideoOn ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>
              
              <IconButton 
                onClick={toggleScreenShare}
                sx={{ 
                  bgcolor: isScreenSharing ? "primary.main" : "rgba(255,255,255,0.2)",
                  color: "white",
                  "&:hover": { bgcolor: isScreenSharing ? "primary.dark" : "rgba(255,255,255,0.3)" }
                }}
              >
                <ScreenShareIcon />
              </IconButton>
              
              <IconButton 
                onClick={toggleChat}
                sx={{ 
                  bgcolor: isChatOpen ? "primary.main" : "rgba(255,255,255,0.2)",
                  color: "white",
                  "&:hover": { bgcolor: isChatOpen ? "primary.dark" : "rgba(255,255,255,0.3)" }
                }}
              >
                <ChatIcon />
              </IconButton>
              
              <IconButton 
                onClick={endCall}
                sx={{ 
                  bgcolor: "error.main",
                  color: "white",
                  "&:hover": { bgcolor: "error.dark" }
                }}
              >
                <CallEndIcon />
              </IconButton>
            </Box>
            
            <Typography 
              sx={{ 
                position: "absolute", 
                bottom: 10, 
                left: 10,
                color: "white",
                bgcolor: "rgba(0,0,0,0.5)",
                padding: "2px 8px",
                borderRadius: 1
              }}
            >
              {participants[0]} (You) {isConnecting && "- Connecting..."}
              {isConnected && "- Connected"}
            </Typography>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 3 }}>
          <Card variant='outlined' sx={{ height: "70vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 2, borderBottom: "1px solid #eee", display: "flex", alignItems: "center" }}>
              <PeopleIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Participants ({participants.length})</Typography>
            </Box>
            
            <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
              <Stack spacing={2}>
                {participants.map((name, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: "flex", 
                      alignItems: "center",
                      p: 1,
                      borderRadius: 1,
                      bgcolor: index === 0 ? "rgba(0,0,0,0.05)" : "transparent"
                    }}
                  >
                    <Avatar sx={{ mr: 2 }}>{name.charAt(0)}</Avatar>
                    <Typography>
                      {name} {index === 0 && "(You)"}
                    </Typography>
                    {index === 0 && (
                      <Box sx={{ ml: "auto", display: "flex" }}>
                        {isMuted && <MicOffIcon fontSize="small" sx={{ color: "error.main" }} />}
                        {!isVideoOn && <VideocamOffIcon fontSize="small" sx={{ color: "error.main", ml: 0.5 }} />}
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
            
            <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
              <Button 
                fullWidth 
                variant="contained" 
                startIcon={<ChatIcon />}
                onClick={toggleChat}
              >
                Open Chat
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
