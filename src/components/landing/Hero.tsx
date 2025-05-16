"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { PAGE_PATH } from "@/path";
import { useT } from "@/i18n/client";
import { HeroConfig } from "@/views/landing/data/hero";
import WireframeSphere from "./WireframeSphere";
import { TypeAnimation } from "react-type-animation";

const interviewQuestions = [
  "Tell me about yourself.",
  3000,
  "What are your biggest strengths and weaknesses?",
  3000,
  "Why do you want to work here?",
  3000,
  "Describe a time you failed. How did you handle it?",
  3000,
  "Tell me about a time you had a conflict with a coworker. How did you resolve it?",
  3000,
  "Where do you see yourself in 5 years?",
  3000,
  "Why should we hire you?",
  3000,
  "Tell me about a time you had to learn something quickly.",
  3000,
  "How do you prioritize when you have multiple deadlines?",
  3000,
  "Do you have any questions for us?"
];

export function Hero({ title, subtitle, info, button }: HeroConfig) {
  const { t } = useT("landing");
  const [currentVolume, setCurrentVolume] = React.useState(0.5);
  const intervalRef = React.useRef<NodeJS.Timeout>();
  const [isAISpeaking, setIsAISpeaking] = React.useState(false);
  const [isGettingReply, setIsGettingReply] = React.useState(false);
  const [displayText, setDisplayText] = React.useState(t(info));
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [initialAnimationComplete, setInitialAnimationComplete] = React.useState(false);

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundRepeat: "no-repeat",
        backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
        ...theme.applyStyles("dark", {
          backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)"
        })
      })}
    >
      <Container
        sx={{
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 }
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2} useFlexGap sx={{ alignItems: "flex-start" }}>
              <Typography
                variant="h1"
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "flex-start",
                  fontSize: "clamp(3rem, 10vw, 3.5rem)",
                  textAlign: "left"
                }}
              >
                {t(title)}
              </Typography>
              <Typography
                variant="h1"
                sx={(theme) => ({
                  textAlign: "left",
                  fontSize: "clamp(3rem, 10vw, 3.5rem)",
                  color: "primary.main",
                  ...theme.applyStyles("dark", {
                    color: "primary.light"
                  })
                })}
              >
                {t(subtitle)}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  textAlign: "left",
                  color: "text.secondary",
                  width: { sm: "100%", md: "80%" }
                }}
              >
                <TypeAnimation sequence={interviewQuestions} wrapper="span" speed={50} repeat={1} cursor={false} preRenderFirstString={false} />
              </Typography>
              <Stack spacing={2} sx={{ width: "100%", mt: 2 }}>
                <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  🚀 Upload your resume & job description for tailored interviews
                </Typography>
                <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  💬 Receive real-time feedback on your responses and communication
                </Typography>
                <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  🎯 Track your progress and improvement over time
                </Typography>
                <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  🎮 Customize difficulty level and interview type
                </Typography>
              </Stack>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                useFlexGap
                justifyContent="flex-start"
                sx={{ pt: 2, width: { xs: "100%", sm: "350px" } }}
              >
                <Button variant="contained" color="primary" size="small" sx={{ minWidth: "fit-content" }} onClick={button.onClick}>
                  {t("hero.button.text")}
                </Button>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                {t("hero.terms")}
                <Link href={PAGE_PATH.termsConditionPage} style={{ color: "var(--mui-palette-primary-main)" }}>
                  Terms & Conditions
                </Link>
                .
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <WireframeSphere participantName="John Doe" isAISpeaking={false} isGettingReply={true} volumeLevel={currentVolume} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
