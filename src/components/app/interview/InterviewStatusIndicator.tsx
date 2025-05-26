import * as React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

interface InterviewStatusIndicatorProps {
  isGettingReply: boolean;
  answerWillCompleteIn: number;
  size?: number;
}

export default function InterviewStatusIndicator({ isGettingReply, answerWillCompleteIn, size = 32 }: InterviewStatusIndicatorProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <AnimatePresence mode="wait">
        {answerWillCompleteIn < 5 && answerWillCompleteIn ? (
          <motion.div
            key="countdown"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Finished? Answer will submit in
              </Typography>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress
                  variant="determinate"
                  value={((5 - answerWillCompleteIn) / 5) * 100}
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
                    {answerWillCompleteIn}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </motion.div>
        ) : isGettingReply ? (
          <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={size * 0.5} thickness={5} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Thinking...
              </Typography>
            </Box>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Box>
  );
}
