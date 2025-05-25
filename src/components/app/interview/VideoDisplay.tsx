import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Webcam from "react-webcam";
import VideoControls from "./VideoControls";
import { WireframeSphere } from "../../landing/WireframeSphere";
import { useColorScheme, useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

interface VideoDisplayProps {
  isMuted: boolean;
  isVideoOn: boolean;
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
  onToggleChat: () => void;
  onEndCall: () => void;
}

export default function VideoDisplay({
  isMuted,
  isVideoOn,
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
  onToggleChat,
  onEndCall,
}: VideoDisplayProps): React.ReactElement {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const isDarkMode = mode === 'dark';
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card 
      variant="outlined"
      sx={{ 
        height: "60vh", 
        display: "flex", 
        flexDirection: "column",
        position: "relative",
        p: 0,
        //bgcolor: isDarkMode ? "#000" : "#f5f5f5"
      }}
    >
      {/* Main AI Avatar */}
      <Box sx={{ position: "relative", width: "100%", height: "100%",  }}>
        <Box sx={{ 
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: isSmallScreen ? "50%" : "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <WireframeSphere
            volumeLevel={volumeLevel}
            isGettingReply={isGettingReply}
            participantName={participantName}
            isAISpeaking={isAISpeaking}
          />
        </Box>
        
        {/* Bottom right user video/avatar */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            right: isSmallScreen ? 0 : 20,
            width: isSmallScreen ? "100%" : "200px",
            height: isSmallScreen ? "50%" : "150px",
            borderRadius: 2,
            overflow: "hidden",
            border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
            borderBottom: isSmallScreen ? 'none' : undefined
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
        isChatOpen={isChatOpen}
        onToggleMute={onToggleMute}
        onToggleVideo={onToggleVideo}
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
        {isConnecting && "Connecting..."}
        {isConnected && "Connected"}
      </Typography>
    </Card>
  );
}