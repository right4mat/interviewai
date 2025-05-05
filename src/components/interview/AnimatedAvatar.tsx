import React from "react";
import { Avatar, Box } from "@mui/material";
import { motion } from "framer-motion";

interface AnimatedAvatarProps {
  participantName: string;
  isAISpeaking: boolean;
  isGettingReply: boolean;
}

export default function AnimatedAvatar({ participantName, isAISpeaking, isGettingReply }: AnimatedAvatarProps) {
  const getRandomScale = () => {
    return Array.from({length: 30}, () => 1.1 + Math.random() * 0.2); // Random values between 0.95 and 1.15
  };

  const getRandomBlur = () => {
    return Array.from({length: 30}, () => Math.floor(10 + Math.random() * 10)); // Random values between 10px and 35px
  };

 

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
      {(isGettingReply || isAISpeaking) && (
        <motion.div
          animate={
            isAISpeaking ? {
              scale: getRandomScale(),
              filter: getRandomBlur().map(blur => `blur(${blur}px)`),
              backgroundColor: "#82b1ff",
              borderRadius: "50%",
              opacity: 0.3,
            } : {
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              borderRadius: ["20%", "50%", "20%"],
              backgroundColor: ["#1976d2", "#2196f3", "#1976d2"],
              filter: ["blur(20px)", "blur(35px)", "blur(20px)"],
            }
          }
          transition={{
            duration: isAISpeaking ? 3 : 2,
            ease: "linear",
            repeat: Infinity,
            times: isAISpeaking ? Array.from({length: 30}, (_, i) => i / 29) : undefined
          }}
          style={{
            position: "absolute",
            width: 120,
            height: 120,
            opacity: 0.9,
          }}
        />
      )}
      <Avatar
        component={motion.div}
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