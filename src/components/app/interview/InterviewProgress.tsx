import * as React from "react";
import {
  Box,
  Card,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScoreProgress from "../shared/ScoreProgress";

interface QuestionAnswer {
  questionSummary: string;
  answer: string;
  score?: number;
  reasoning?: string;
  modelAnswer?: string;
}

interface InterviewProgressProps {
  isGettingReply: boolean;
  currentQuestion?: string;
  cleanedAnswer?: string;
  buildingAnswer?: string;
  isScoring: boolean;
  questionAnswers: QuestionAnswer[];
  started: boolean;
  finished: boolean;
  answerWillCompleteIn: number;
}

const StatusPaper = ({ children, color = "primary" }: { children: React.ReactNode, color?: "primary" | "success" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: `${color}.light`,
        borderLeft: "4px solid",
        borderLeftColor: `${color}.main`,
        bgcolor: "background.paper",
        position: "relative",
        overflow: "hidden",
        height: "auto",
        minHeight: "64px",
      }}
    >
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
    </Paper>
  </motion.div>
);

const ScoreCircle = ({ score }: { score?: number }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
  >
    <ScoreProgress score={score || 0} size={50} thickness={4} />
  </motion.div>
);

const QuestionHistory = ({ qa, index }: { qa: QuestionAnswer, index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Accordion
      sx={{
        width: "100%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        borderRadius: "8px !important",
        "&:before": { display: "none" },
        mb: 1.5
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          borderRadius: "8px",
          "&.Mui-expanded": {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            display: "flex",
            flexDirection: "column"
          }
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Question</Typography>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500, flex: 1, mr: 1 }}>
              {qa.questionSummary}
            </Typography>
            <ScoreCircle score={qa.score} />
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2, py: 1.5, bgcolor: "background.default", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }}>
        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Your Answer:</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, pl: 1, borderLeft: "2px solid", borderColor: "divider", py: 0.5 }}>
          {qa.answer}
        </Typography>

        <AnimatePresence>
          {qa.reasoning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Divider sx={{ my: 1.5 }}>
                <Chip icon={<AssessmentIcon fontSize="small" />} label="Feedback" size="small" color="primary" variant="outlined" />
              </Divider>
              <Typography variant="body2" sx={{ fontStyle: "italic", color: "text.secondary", pl: 1 }}>
                {qa.reasoning}
              </Typography>
            </motion.div>
          )}

          {qa.modelAnswer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Divider sx={{ my: 1.5 }}>
                <Chip icon={<QuestionAnswerIcon fontSize="small" />} label="Model Answer" size="small" color="success" variant="outlined" />
              </Divider>
              <Typography variant="body2" sx={{ color: "success.light", pl: 1, borderLeft: "2px solid", borderColor: "success.light", py: 0.5 }}>
                {qa.modelAnswer}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </AccordionDetails>
    </Accordion>
  </motion.div>
);

export default function InterviewProgress({
  isGettingReply,
  currentQuestion,
  cleanedAnswer,
  buildingAnswer,
  isScoring,
  questionAnswers,
  started,
  finished,
  answerWillCompleteIn
}: InterviewProgressProps): React.ReactElement {
  const questionsContainerRef = React.useRef<HTMLDivElement>(null);
  const reversedQuestionAnswers = useMemo(() => [...questionAnswers].reverse(), [questionAnswers]);

  React.useEffect(() => {
    if (questionsContainerRef.current) {
      questionsContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [questionAnswers.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        variant="outlined"
        sx={{
          bgcolor: "background.paper",
          padding: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <QuestionAnswerIcon />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>Interview Progress</Typography>
          </Box>
          {answerWillCompleteIn > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress
                  variant="determinate"
                  value={(5 - answerWillCompleteIn) / 5 * 100}
                  size={30}
                  thickness={4}
                  sx={{ color: "primary.contrastText" }}
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
                  <Typography variant="caption" component="div" color="primary.contrastText">
                    {answerWillCompleteIn}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          )}
        </Box>

        <Box sx={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", p: 2, gap: 2 }}>
          <AnimatePresence mode="wait">
            <StatusPaper color={finished ? "success" : "primary"}>
              {!started && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: "primary.main", fontSize: "0.875rem" }}>AI</Avatar>
                    <Typography variant="body1">Press the start button to begin your interview</Typography>
                  </Box>
                </motion.div>
              )}

              {finished && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: "success.main", fontSize: "0.875rem" }}>AI</Avatar>
                    <Typography variant="body1" color="success.main" sx={{ fontWeight: 500 }}>Interview Complete!</Typography>
                  </Box>
                </motion.div>
              )}

              {started && !finished && (
                isGettingReply ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: "primary.main", fontSize: "0.875rem" }}>AI</Avatar>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={16} thickness={6} />
                        <Typography variant="body1">Thinking...</Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ) : currentQuestion && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, gap: 1 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: "primary.main", fontSize: "0.875rem" }}>AI</Avatar>
                      <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 600 }}>Current Question:</Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>{currentQuestion}</Typography>

                    {(cleanedAnswer || buildingAnswer) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        <Divider sx={{ my: 1.5 }}>
                          <Chip label="Your Response" size="small" variant="outlined" />
                        </Divider>
                        <Typography variant="body2" color="text.secondary" sx={{ pl: 1, borderLeft: "2px solid", borderColor: "divider", py: 0.5 }}>
                          {cleanedAnswer || buildingAnswer}
                        </Typography>
                      </motion.div>
                    )}

                    {isScoring && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2, gap: 1 }}>
                          <CircularProgress size={16} thickness={6} />
                          <Typography variant="caption" color="text.secondary">Analyzing your response...</Typography>
                        </Box>
                      </motion.div>
                    )}
                  </motion.div>
                )
              )}
            </StatusPaper>
          </AnimatePresence>

          <Box ref={questionsContainerRef} sx={{ flex: 1, overflow: "auto", maxHeight: "60vh" }}>
            <AnimatePresence>
              {reversedQuestionAnswers.map((qa, index) => (
                <QuestionHistory key={JSON.stringify(qa)} qa={qa} index={index} />
              ))}
            </AnimatePresence>
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
}