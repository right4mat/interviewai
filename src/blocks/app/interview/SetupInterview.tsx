import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
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
import Fade from "@mui/material/Fade";
import Collapse from "@mui/material/Collapse";
import { useJobDescriptionSummary } from "@/services/appServices";
import { useRouter } from "next/navigation";
import { PAGE_PATH } from "@/path";

const SetupInterview: React.FC = () => {
  const { interviewState, setJobDescription, setResume, setInterviewer, setSettings, setStage, updateInterviewState } = useInterviewStore();
  const router = useRouter();

  const [showInterviewers, setShowInterviewers] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const jobDescriptionSummaryMutation = useJobDescriptionSummary();

  const handleSubmit = () => {
    if (!interviewState.jobDescription) {
      alert("Job description is required");
    } else {
      setStage("interview");
    }
  };

  const handleNext = async () => {
    // If we're on the job description step, get the summary before proceeding
    if (activeStep === 0) {
      try {
        const response = await jobDescriptionSummaryMutation.mutateAsync({
          jobDescription: interviewState.jobDescription
        });
        updateInterviewState({ jobDescriptionId: response.id, company: response.company });
      } catch (error) {
        console.error("Failed to get job description summary:", error);
        alert("Failed to process job description. Please try again.");
        return;
      }
    }
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      router.push(PAGE_PATH.appRoot);
    } else {
      setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
    }
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
          width: 50,
          height: 50,
          display: "flex",
          borderRadius: "50%",
          justifyContent: "center",
          alignItems: "center",
          border: "2px solid",
          borderColor: active || completed ? "primary.main" : "divider",
          padding: 1,
          boxShadow: active || completed ? 3 : 1,
          transition: "all 0.3s ease-in-out"
        }}
      >
        {completed ? <CheckIcon /> : icons[String(icon)]}
      </Box>
    );
  };

  const steps = [
    {
      icon: <WorkIcon />,
      content: (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.02)"
            }
          }}
        >
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            Job Description
          </Typography>
          <JobDescriptionInput
            value={interviewState.jobDescription}
            onChange={setJobDescription}
            loading={jobDescriptionSummaryMutation.isPending}
          />
        </Paper>
      ),
      isValid: interviewState.jobDescription.trim().length > 0
    },
    {
      icon: <DescriptionIcon />,
      content: (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.02)"
            }
          }}
        >
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            Resume
          </Typography>
          <FileUpload
            resumeId={interviewState.resumeId}
            setResumeId={setResume}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        </Paper>
      ),
      isValid: true // Resume is optional
    },
    {
      icon: <PeopleIcon />,
      content: (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.02)"
            }
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
              Interview Settings (Optional)
            </Typography>
            <Button
              startIcon={showInterviewers ? <RemoveIcon /> : <AddIcon />}
              onClick={() => setShowInterviewers(!showInterviewers)}
              color="primary"
              variant="text"
              sx={{ fontWeight: 500 }}
            >
              {showInterviewers ? "Hide" : "Show"}
            </Button>
          </Box>

          <Collapse in={showInterviewers} timeout={300}>
            <InterviewerSetup
              interviewer={interviewState.interviewer}
              setInterviewer={setInterviewer}
              settings={interviewState.settings}
              setSettings={setSettings}
            />
          </Collapse>
        </Paper>
      ),
      isValid: true // Interviewers are optional
    }
  ];

  const currentStep = steps[activeStep];

  return (
    <Container maxWidth="lg" sx={{ width: "100%" , pt: 1, boxSizing: "border-box"}} disableGutters>
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
              mb: 2,
              "& .MuiStepLabel-label": {
                typography: "body1",
                fontWeight: "bold",
                color: "text.primary"
              }
            }}
          >
            {steps.map((step, index) => (
              <Step key={index} completed={index < activeStep}>
                <StepLabel StepIconComponent={CustomStepIcon}>
                  <Typography variant="body2" color={index === activeStep ? "primary.main" : "text.secondary"}>
                    Step {index + 1}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Fade in key={activeStep} timeout={500}>
            <Box>
              {currentStep?.content}

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
                  Back
                </Button>

                <Button
                  variant={!currentStep?.isValid ? "outlined" : "contained"}
                  endIcon={activeStep < steps.length - 1 ? <ArrowForwardIcon /> : undefined}
                  onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                  disabled={!currentStep?.isValid}
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
