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
import { type HeroConfig } from "@/views/landing/data/hero";
import { TypeAnimation } from "react-type-animation";
import { useSearchParams, useRouter } from "next/navigation";
import Badge from "./badge";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import WireframeSphereLanding from "./WireframeSphereLanding";
import useToast from "@/hooks/useToast";
import { DifficultyChip } from "../app/shared/StyledChips";
import { useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const interviewQuestionsByIndustry = {
  general: [
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
  ],
  softwareEngineering: [
    "Can you explain a challenging technical problem you solved and how you approached it?",
    3000,
    "How do you ensure the quality and maintainability of your code?",
    3000,
    "Tell me about a time you had a disagreement with a teammate over a technical solution. How was it resolved?",
    3000,
    "How do you stay up to date with new technologies and industry trends?",
    3000,
    "Describe a time when you had to learn a new language or framework quickly to complete a project.",
    3000,
    "How do you prioritize tasks when working on multiple projects or tight deadlines?",
    3000,
    "What's your process for debugging a complex issue in production?",
    3000,
    "How do you handle technical debt in your projects?",
    3000,
    "Can you describe a time when you made a significant performance optimization?",
    3000,
    "What's the most important aspect of writing scalable and efficient code?"
  ]
};

export function Hero({ title, subtitle, info, button }: HeroConfig) {
  const { t } = useT("landing");
  const theme = useTheme();
  const { addToast } = useToast();
  const [currentVolume, setCurrentVolume] = React.useState(0.5);
  const [isExcited, setIsExcited] = React.useState(false);
  const [isStartingInterview, setIsStartingInterview] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const industry = searchParams.get("industry") || "general";
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const dummyData = [
    {
      firstName: "Sarah",
      timeAgo: "2 minutes ago",
      company: "Commonwealth Bank",
      difficulty: "intermediate"
    },
    {
      firstName: "Michael",
      timeAgo: "5 minutes ago",
      company: "Envato",
      difficulty: "advanced"
    },
    {
      firstName: "Emma",
      timeAgo: "7 minutes ago",
      company: "Aconex",
      difficulty: "beginner"
    },
    {
      firstName: "James",
      timeAgo: "10 minutes ago",
      company: "Culture Amp",
      difficulty: "intermediate"
    },
    {
      firstName: "Lisa",
      timeAgo: "12 minutes ago",
      company: "NAB",
      difficulty: "advanced"
    },
    {
      firstName: "David",
      timeAgo: "15 minutes ago",
      company: "Buildkite",
      difficulty: "intermediate"
    },
    {
      firstName: "Jessica",
      timeAgo: "18 minutes ago",
      company: "99designs",
      difficulty: "beginner"
    },
    {
      firstName: "Alex",
      timeAgo: "20 minutes ago",
      company: "SafetyCulture",
      difficulty: "advanced"
    },
    {
      firstName: "Emily",
      timeAgo: "23 minutes ago",
      company: "Coles Group",
      difficulty: "intermediate"
    },
    {
      firstName: "Daniel",
      timeAgo: "25 minutes ago",
      company: "Octopus Deploy",
      difficulty: "advanced"
    },
    {
      firstName: "Sophia",
      timeAgo: "28 minutes ago",
      company: "Whispir",
      difficulty: "beginner"
    },
    {
      firstName: "Ryan",
      timeAgo: "30 minutes ago",
      company: "Xero",
      difficulty: "intermediate"
    },
    {
      firstName: "Olivia",
      timeAgo: "33 minutes ago",
      company: "Tyro Payments",
      difficulty: "advanced"
    },
    {
      firstName: "William",
      timeAgo: "35 minutes ago",
      company: "WiseTech Global",
      difficulty: "intermediate"
    },
    {
      firstName: "Ava",
      timeAgo: "38 minutes ago",
      company: "Optus",
      difficulty: "beginner"
    },
    {
      firstName: "Thomas",
      timeAgo: "40 minutes ago",
      company: "Nearmap",
      difficulty: "intermediate"
    },
    {
      firstName: "Isabella",
      timeAgo: "43 minutes ago",
      company: "Pushpay",
      difficulty: "advanced"
    },
    {
      firstName: "John",
      timeAgo: "45 minutes ago",
      company: "Wesfarmers",
      difficulty: "intermediate"
    },
    {
      firstName: "Mia",
      timeAgo: "48 minutes ago",
      company: "Appen",
      difficulty: "beginner"
    },
    {
      firstName: "Lucas",
      timeAgo: "50 minutes ago",
      company: "Nitro Software",
      difficulty: "advanced"
    }
  ];

  const showRandomToast = () => {
    const randomEntry = dummyData[Math.floor(Math.random() * dummyData.length)];
    if (randomEntry?.difficulty) {
      addToast(
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-start", gap: 1, flexDirection: "column" }}>
          <DifficultyChip label={randomEntry.difficulty} size="small" />
          {`${randomEntry?.firstName} started interview ${randomEntry?.timeAgo} for ${randomEntry?.company}`}
        </Box>,
        "brand"
      );
    }
  };

  React.useEffect(() => {
    // Show first toast quickly
    const initialTimeout = setTimeout(showRandomToast, 10000);
    return () => clearTimeout(initialTimeout);
  }, []); // Run only once on mount

  React.useEffect(() => {
    // Start recurring toasts after a delay
    const recurringTimeout = setTimeout(() => {
      const intervalId = setInterval(showRandomToast, 50000);
      return () => clearInterval(intervalId);
    }, 60000); // Start recurring after 30s (initial 10s + first interval 20s)

    return () => clearTimeout(recurringTimeout);
  }, []); // Run only once on mount

  const handleButtonClick = () => {
    setIsStartingInterview(true);
    router.prefetch(PAGE_PATH.appRoot);
    setTimeout(() => {
      router.push(PAGE_PATH.appRoot);
    }, 150);
  };

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundRepeat: "no-repeat",
        backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
        ...theme.applyStyles("dark", {
          backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)"
        }),
        transition: "height 1s ease-in-out" // Smooth transition for height changes
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
            <Stack
              spacing={2}
              useFlexGap
              sx={{
                alignItems: "flex-start",
                transition: "height 1s ease-in-out" // Smooth transition for height changes
              }}
            >
              <Stack alignItems="flex-start" sx={{ width: "100%", position: "relative" }}>
                <Typography
                  variant="h1"
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "flex-start",
                    fontSize: "clamp(3rem, 10vw, 3.5rem)",
                    textAlign: isSmallScreen ? "center" : "left"
                  }}
                >
                  {t(title)}
                </Typography>
                <Typography
                  variant="h1"
                  sx={(theme) => ({
                    textAlign: isSmallScreen ? "center" : "left",
                    fontSize: "clamp(3rem, 10vw, 3.5rem)",
                    color: "primary.main",
                    ...theme.applyStyles("dark", {
                      color: "primary.light"
                    })
                  })}
                >
                  {t(subtitle)}
                </Typography>
              </Stack>
              <Box style={{ position: "relative", width: "100%" }}>
                <Box sx={{ position: "absolute", top: "0", left: "0", right: 0, bottom: 0, zIndex: 1000 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textAlign: isSmallScreen ? "center" : "left",
                      color: "text.secondary",
                      width: "100%"
                    }}
                  >
                    <TypeAnimation
                      sequence={[
                        t("hero.info"),
                        3000,
                        ...interviewQuestionsByIndustry[industry as keyof typeof interviewQuestionsByIndustry]
                      ]}
                      wrapper="span"
                      speed={50}
                      repeat={999}
                      cursor={false}
                      preRenderFirstString={false}
                    />
                  </Typography>
                </Box>
                <Box sx={{ opacity: "0", mb:1}} aria-hidden={true}>
                  {t("hero.info")}
                </Box>
              </Box>

              <Stack spacing={2} sx={{ width: "100%", mt: 2 }}>
              { isSmallScreen && <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  sx={{ minWidth: "fit-content", fontWeight: "bold",my:2 }}
                  onClick={handleButtonClick}
                  onMouseEnter={() => setIsExcited(true)}
                  onMouseLeave={() => setIsExcited(false)}
                >
                  {t("hero.button.text")}
                </Button>}
                <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: "bold" }}>
                  <span style={{ fontSize: "1.2em" }}>🚀</span> Upload your resume & job description for tailored interviews
                </Typography>
                <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: "bold" }}>
                  <span style={{ fontSize: "1.2em" }}>💬</span> Receive real-time feedback on your responses and communication
                </Typography>
                <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: "bold" }}>
                  <span style={{ fontSize: "1.2em" }}>🎯</span> Track your progress and improvement over time
                </Typography>
                <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: "bold" }}>
                  <span style={{ fontSize: "1.2em" }}>🎮</span> Customize difficulty level and interview type
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={4}
                useFlexGap
                justifyContent="flex-start"
                alignItems="center"
                sx={{ pt: 2, width: { xs: "100%", sm: "350px" } }}
              >
                <Badge size="small" />
                { !isSmallScreen && <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  sx={{ minWidth: "fit-content", fontWeight: "bold" }}
                  onClick={handleButtonClick}
                  onMouseEnter={() => setIsExcited(true)}
                  onMouseLeave={() => setIsExcited(false)}
                >
                  {t("hero.button.text")}
                </Button>}
              </Stack>
            </Stack>
            <Stack spacing={2} flexDirection="row" justifyContent="flex-start" alignItems="center" sx={{ mt: 4 }}>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                {t("hero.terms")}
                <Link href={PAGE_PATH.termsConditionPage} style={{ color: "var(--mui-palette-primary-main)" }}>
                  Terms & Conditions
                </Link>
                .
              </Typography>
            </Stack>
          </Grid>
          {!isSmallScreen && (
            <Grid size={{ xs: 12, md: 6 }}>
              <WireframeSphereLanding
                participantName="John Doe"
                isAISpeaking={false}
                isGettingReply={true}
                volumeLevel={currentVolume}
                isExcited={isExcited}
                isStartingInterview={isStartingInterview}
                onHover={(bool) => setIsExcited(bool)}
                onClick={handleButtonClick}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}
