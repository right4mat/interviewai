import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Webcam from "react-webcam";
import VideoControls from "./VideoControls";
import AnimatedAvatar from "./AnimatedAvatar";

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
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onEndCall,
}: VideoDisplayProps): React.ReactElement {
  return (
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
        <AnimatedAvatar
          participantName={participantName}
          isAISpeaking={isAISpeaking}
        />
      )}

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
          color: "white",
          bgcolor: "rgba(0,0,0,0.5)",
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