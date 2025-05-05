import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Webcam from "react-webcam";
import VideoControls from "./VideoControls";
import AnimatedAvatar from "./AnimatedAvatar";
import { useColorScheme, useTheme } from "@mui/material/styles";

interface VideoDisplayProps {
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  isChatOpen: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  participantName: string;
  webcamRef: React.RefObject<Webcam>;
  isAISpeaking: boolean;
  isGettingReply: boolean;
  volumeLevel: number;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleChat: () => void;
  onEndCall: () => void;
}

export default function VideoDisplay({
  isMuted,
  isVideoOn,
  isScreenSharing,
  isChatOpen,
  isConnecting,
  isConnected,
  participantName,
  webcamRef,
  isAISpeaking,
  isGettingReply, 
  volumeLevel,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onEndCall,
}: VideoDisplayProps): React.ReactElement {
  const { mode } = useColorScheme();
  const isDarkMode = mode === 'dark';

  return (
    <Card 
      variant="outlined"
      sx={{ 
        height: "70vh", 
        display: "flex", 
        flexDirection: "column",
        position: "relative",
        //bgcolor: isDarkMode ? "#000" : "#f5f5f5"
      }}
    >
      {/* Main AI Avatar */}
      <Box sx={{ position: "relative", width: "100%", height: "100%", bgcolor: isDarkMode ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.6)" }}>
        <AnimatedAvatar
          volumeLevel={volumeLevel}
          isGettingReply={isGettingReply}
          participantName={participantName}
          isAISpeaking={isAISpeaking}
        />
        
        {/* Bottom right user video/avatar */}
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            right: 20,
            width: "200px",
            height: "150px",
            borderRadius: 2,
            overflow: "hidden",
            border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`
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
            <Box sx={{ width: "100%", height: "100%", bgcolor: isDarkMode ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography sx={{ color: isDarkMode ? "white" : "black" }}>Camera Off</Typography>
            </Box>
          )}
        </Box>
      </Box>

      <VideoControls
        isMuted={isMuted}
        isVideoOn={isVideoOn}
        isScreenSharing={isScreenSharing}
        isChatOpen={isChatOpen}
        onToggleMute={onToggleMute}
        onToggleVideo={onToggleVideo}
        onToggleScreenShare={onToggleScreenShare}
        onToggleChat={onToggleChat}
        onEndCall={onEndCall}
      />
      
      <Typography 
        sx={{ 
          position: "absolute", 
          bottom: 10, 
          left: 10,
          color: isDarkMode ? "white" : "black",
          bgcolor: isDarkMode ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.8)",
          padding: "2px 8px",
          borderRadius: 1
        }}
      >
        {participantName} (You) {isConnecting && "- Connecting..."}
        {isConnected && "- Connected"}
      </Typography>
    </Card>
  );
}