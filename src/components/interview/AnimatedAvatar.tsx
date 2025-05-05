import React, { useMemo, useRef, useEffect } from "react";
import { Avatar, Box } from "@mui/material";
import { motion } from "framer-motion";

interface AnimatedAvatarProps {
  participantName: string;
  isAISpeaking: boolean;
  isGettingReply: boolean;
  volumeLevel: number;
}

export default React.memo(function AnimatedAvatar({ participantName, isAISpeaking, isGettingReply, volumeLevel }: AnimatedAvatarProps) {
  const scaleRef = useRef(1);
  const blurRef = useRef(5);
  const animationFrameRef = useRef<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastTimestamp = 0;
    const animationDuration = 300; // 300ms duration
    let startScale = scaleRef.current;
    let startBlur = blurRef.current;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      const progress = Math.min(elapsed / animationDuration, 1);

      if (isAISpeaking && elementRef.current) {
        // Limit the maximum scale to prevent massive growth
        const targetScale = 1 + volumeLevel * 0.002; // Max 30% growth
        const targetBlur = 5 + volumeLevel * 0.02; // Max 8px blur

        scaleRef.current = startScale + (targetScale - startScale) ;
        blurRef.current = startBlur + (targetBlur - startBlur) ;

        elementRef.current.style.transform = `scale(${scaleRef.current})`;
        elementRef.current.style.filter = `blur(${blurRef.current}px)`;
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (isAISpeaking) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAISpeaking, volumeLevel]);

  const variants = useMemo(
    () => ({
      loading: {
        scale: [1, 1.1, 1],
        rotate: [0, 180, 360],
        borderRadius: ["30%", "50%", "30%"],
        backgroundColor: "#82b1ff",
        filter: ["blur(10px)", "blur(20px)", "blur(10px)"]
      },
      listening: {
        scale: [1, 1.03, 1],
        rotate: [0, 180, 360],
        borderRadius: ["45%", "50%", "45%"],
        backgroundColor: "#82b1ff",
        filter: ["blur(5px)", "blur(8px)", "blur(5px)"]
      }
    }),
    []
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "transparent",
        position: "relative",
    
      }}
    >
      <motion.div
        ref={elementRef}
        variants={variants}
        animate={isAISpeaking ? undefined : isGettingReply ? "loading" : "listening"}
        transition={{
          duration: isAISpeaking ? 1 : isGettingReply ? 3 : 4,
          ease: "easeInOut",
          repeat: Infinity,
          times: isAISpeaking ? undefined : [0, 0.5, 1]
        }}
        style={{
          backgroundColor: "#82b1ff",
          position: "absolute",
          width: 120,
          height: 120,
          opacity: isGettingReply ? 0.9 : 0.5,
          borderRadius: "50%"
        }}
      />
      <Avatar
        component={motion.div}
        sx={{
          width: 120,
          height: 120,
          fontSize: "3rem",
          zIndex: 1,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          opacity: 0.8

        }}
      >
        {participantName.charAt(0)}
      </Avatar>
    </Box>
  );
});
