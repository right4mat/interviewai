import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import CallEndIcon from "@mui/icons-material/CallEnd";

interface VideoControlsProps {
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  isChatOpen: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleChat: () => void;
  onEndCall: () => void;
}

export default function VideoControls({
  isMuted,
  isVideoOn,
  isScreenSharing,
  isChatOpen,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onEndCall,
}: VideoControlsProps): React.ReactElement {
  return (
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
        onClick={onToggleMute} 
        sx={{ 
          bgcolor: isMuted ? "error.main" : "rgba(255,255,255,0.2)",
          color: "white",
          "&:hover": { bgcolor: isMuted ? "error.dark" : "rgba(255,255,255,0.3)" }
        }}
      >
        {isMuted ? <MicOffIcon /> : <MicIcon />}
      </IconButton>
      
      <IconButton 
        onClick={onToggleVideo}
        sx={{ 
          bgcolor: !isVideoOn ? "error.main" : "rgba(255,255,255,0.2)",
          color: "white",
          "&:hover": { bgcolor: !isVideoOn ? "error.dark" : "rgba(255,255,255,0.3)" }
        }}
      >
        {isVideoOn ? <VideocamIcon /> : <VideocamOffIcon />}
      </IconButton>
      
      <IconButton 
        onClick={onToggleScreenShare}
        sx={{ 
          bgcolor: isScreenSharing ? "primary.main" : "rgba(255,255,255,0.2)",
          color: "white",
          "&:hover": { bgcolor: isScreenSharing ? "primary.dark" : "rgba(255,255,255,0.3)" }
        }}
      >
        <ScreenShareIcon />
      </IconButton>
      
      <IconButton 
        onClick={onToggleChat}
        sx={{ 
          bgcolor: isChatOpen ? "primary.main" : "rgba(255,255,255,0.2)",
          color: "white",
          "&:hover": { bgcolor: isChatOpen ? "primary.dark" : "rgba(255,255,255,0.3)" }
        }}
      >
        <ChatIcon />
      </IconButton>
      
      <IconButton 
        onClick={onEndCall}
        sx={{ 
          bgcolor: "error.main",
          color: "white",
          "&:hover": { bgcolor: "error.dark" }
        }}
      >
        <CallEndIcon />
      </IconButton>
    </Box>
  );
} 