import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import JobDescriptionInput from "@/components/app/setupInterview/JobDescriptionInput";
import FileUpload from "@/components/app/setupInterview/FileUpload";
import InterviewerSetup from "@/components/app/setupInterview/InterviewerSetup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import WorkIcon from "@mui/icons-material/Work";
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleIcon from "@mui/icons-material/People";
import CheckIcon from "@mui/icons-material/Check";
import { useInterviewStore } from "@/stores/interviewStore";
import { useExtractResume } from "@/services/appServices";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";

const SetupInterview: React.FC = () => {
  const { interviewState, setJobDescription, setPdfFile, setResume, setInterviewer, setSettings, setStage } = useInterviewStore();
  const extractResume = useExtractResume();

  const [showInterviewers, setShowInterviewers] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handlePdfFileChange = async (file: File | undefined) => {
    setPdfFile(file);
    if (file) {
      try {
        const result = await extractResume.mutateAsync(file);
        if (result?.resumeId) {
          setResume(result.resumeId);
        }
      } catch (error) {
        console.error("Failed to extract text from pdf:", error);
      }
    }
  };

  const handleSubmit = () => {
    if (!interviewState.jobDescription) {
      alert("Job description is required");
    } else {
      setStage("interview");
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };

  // Custom StepIcon component to render icons in primary color and inside a circle
  const CustomStepIcon = (props: any) => {
    const { active, completed, icon } = props;

    const icons: { [index: string]: React.ReactElement } = {
      1: <WorkIcon />,
      2: <DescriptionIcon />,
      3: <PeopleIcon />
    };

    return (
      <Box
        sx={{
          backgroundColor: active || completed ? "primary.main" : "background.paper",
          color: active || completed ? "primary.contrastText" : "text.secondary",
          width: 40,
          height: 40,
          display: "flex",
          borderRadius: "50%",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid",
          borderColor: active || completed ? "primary.main" : "divider",
          padding: 1,
          boxShadow: active || completed ? 1 : 0
        }}
      >
        {completed ? <CheckIcon /> : icons[String(icon)]}
      </Box>
    );
  };

  const steps = [
    {
      label: "Job Description",
      description: "Enter the job description for this interview",
      icon: <WorkIcon />,
      content: (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper"
          }}
        >
          <JobDescriptionInput value={interviewState.jobDescription} onChange={setJobDescription} />
        </Paper>
      ),
      isValid: interviewState.jobDescription.trim().length > 0
    },
    {
      label: "Resume",
      description: "Upload the candidate's resume",
      icon: <DescriptionIcon />,
      content: (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper"
          }}
        >
          <FileUpload isPending={extractResume.isPending} onFileSelect={handlePdfFileChange} selectedFile={interviewState.pdfFile} />
        </Paper>
      ),
      isValid: true // Resume is optional
    },
    {
      label: "Interviewers",
      description: "Add custom interviewers (optional)",
      icon: <PeopleIcon />,
      content: (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper"
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: showInterviewers ? 2 : 0
            }}
          >
            <Typography variant="h6" fontWeight="medium">
              Interviewers
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setShowInterviewers(!showInterviewers)}
              color="primary"
              variant="text"
              sx={{ fontWeight: 500 }}
            >
              {showInterviewers ? "Hide" : "Configure Interviewers"}
            </Button>
          </Box>

          {showInterviewers && (
            <InterviewerSetup
              interviewer={interviewState.interviewer}
              setInterviewer={setInterviewer}
              settings={interviewState.settings}
              setSettings={setSettings}
            />
          )}
        </Paper>
      ),
      isValid: true // Interviewers are optional
    }
  ];

  const currentStep = steps[activeStep];

  return (
    <Container maxWidth="md" sx={{ width: "100%" }}>
      <Grid container spacing={4} sx={{ minWidth: "100%" }}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom textAlign="center">
            Setup Interview
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              mb: 2
            }}
          >
            {steps.map((step, index) => (
              <Step key={step.label} completed={index < activeStep}>
                <StepLabel StepIconComponent={CustomStepIcon}>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Fade in key={activeStep} timeout={500}>
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {currentStep.label}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {currentStep.description}
              </Typography>

              {currentStep.content}

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>

                <Button
                  variant={!currentStep.isValid ? "outlined" : "contained"}
                  endIcon={activeStep < steps.length - 1 ? <ArrowForwardIcon /> : undefined}
                  onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                  disabled={!currentStep.isValid}
                >
                  {activeStep === steps.length - 1 ? "Complete Setup" : "Continue"}
                </Button>
              </Box>
            </Box>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SetupInterview;
