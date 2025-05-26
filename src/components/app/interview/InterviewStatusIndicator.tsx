import * as React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

interface InterviewStatusIndicatorProps {
  isGettingReply: boolean;
  answerWillCompleteIn: number;
  buildingAnswer?: string;
  size?: number;
}

interface StatusIndicatorBaseProps {
  size: number;
  children: React.ReactNode;
  animationKey: string;
}

const StatusIndicatorBase: React.FC<StatusIndicatorBaseProps> = ({ size, children, animationKey }) => (
  <motion.div
    key={animationKey}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {children}
    </Box>
  </motion.div>
);

interface LoadingStatusProps {
  size: number;
  message: React.ReactNode;
}

const LoadingStatus: React.FC<LoadingStatusProps> = ({ size, message }) => (
  <StatusIndicatorBase size={size} animationKey="loading">
    <CircularProgress size={size * 0.5} thickness={5} />
    <Typography 
      variant="body2" 
      color="text.secondary" 
      sx={{ 
        ml: 1,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "200px"
      }}
    >
      {message}
    </Typography>
  </StatusIndicatorBase>
);

interface CountdownStatusProps {
  size: number;
  timeRemaining: number;
}

const CountdownStatus: React.FC<CountdownStatusProps> = ({ size, timeRemaining }) => (
  <motion.div
    key="countdown"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    exit={{ scale: 0 }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
  >
    <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 1 }}>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          ml: 1,
          whiteSpace: "nowrap"
        }}
      >
        Finished? Answer will submit in
      </Typography>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          variant="determinate"
          value={((5 - timeRemaining) / 5) * 100}
          size={size}
          thickness={4}
          sx={{ color: "primary.main" }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Typography variant="caption" component="div" color="primary.main">
            {timeRemaining}
          </Typography>
        </Box>
      </Box>
    </Box>
  </motion.div>
);

interface BuildingAnswerStatusProps {
  size: number;
  message: React.ReactNode;
}

const getLastNWords = (text: string, n: number = 4): string => {
  if (typeof text !== 'string') return String(text);
  const words = text.split(' ');
  if (words.length <= n) return text;
  return `...${words.slice(-n).join(' ')}`;
};

const BuildingAnswerStatus: React.FC<BuildingAnswerStatusProps> = ({ size, message }) => (
  <StatusIndicatorBase size={size} animationKey="building">
    <CircularProgress size={size * 0.5} thickness={5} />
    <Typography 
      variant="body2" 
      color="text.secondary" 
      sx={{ 
        ml: 1,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "200px"
      }}
    >
      Building: {getLastNWords(String(message))}
    </Typography>
  </StatusIndicatorBase>
);

export default function InterviewStatusIndicator({
  isGettingReply,
  answerWillCompleteIn,
  buildingAnswer,
  size = 32
}: InterviewStatusIndicatorProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <AnimatePresence mode="wait">
        {isGettingReply ? (
          <LoadingStatus size={size} message="Thinking..." />
        ) : answerWillCompleteIn < 5 && answerWillCompleteIn ? (
          <CountdownStatus size={size} timeRemaining={answerWillCompleteIn} />
        ) : buildingAnswer ? (
          <BuildingAnswerStatus size={size} message={buildingAnswer} />
        ) : null}
      </AnimatePresence>
    </Box>
  );
}
