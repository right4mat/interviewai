import { useEffect, useRef, useState } from "react";
import { Avatar, Box } from "@mui/material";

interface AnimatedAvatarProps {
  participantName: string;
  isAISpeaking: boolean;
}

export default function AnimatedAvatar({ participantName, isAISpeaking }: AnimatedAvatarProps) {
  const [currentAmplitude, setCurrentAmplitude] = useState(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (!isAISpeaking) {
      setCurrentAmplitude(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (timestamp - lastUpdateRef.current >= 200) {
        // Generate random amplitude between 0 and 1
        const randomAmplitude = Math.random() * 0.5;
        setCurrentAmplitude(randomAmplitude);
        lastUpdateRef.current = timestamp;
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAISpeaking]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#333",
        position: "relative"
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.2)",
          filter: `blur(${20 + currentAmplitude * 30}px)`,
          transform: `scale(${1.2 + currentAmplitude * 0.3})`,
          transition: 'all 200ms linear',
          opacity: 0.9
        }}
      />
      <Avatar
        sx={{
          width: 120,
          height: 120,
          fontSize: "3rem",
          zIndex: 1
        }}
      >
        {participantName.charAt(0)}
      </Avatar>
    </Box>
  );
} 