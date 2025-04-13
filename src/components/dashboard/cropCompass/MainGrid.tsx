"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import NutrientInput from "./NutrientInput";
import AnalysisView from "./AnalysisView";
import Recommendations from "./Recommendations";
import { calculateNetChargeBalance, calculateWhiltRiskValue } from "./utils";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { GridRowsProp, GridValidRowModel } from "@mui/x-data-grid";

// Define steps directly in this file
const steps = ["Input Data", "Analysis", "Recommendations"];

// Define Row interface to match the expected type in utility functions
interface Row {
  id: number;
  element: string;
  ppm: string | number | null;
  percent: string | number | null;
}

export default function MainGrid(): React.ReactElement {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [nutrientData, setNutrientData] = useState<Record<string, number>>({});
  const [netChargeBalance, setNetChargeBalance] = useState<number>(0);
  const [whiltRisk, setWhiltRisk] = useState<number>(0);
  const [inputValues, setInputValues] = useState<Record<number, { ppm: string | null; percent: string | null }>>({});
  const [isDryTissue, setIsDryTissue] = useState<boolean>(false);
  const [rows, setRows] = useState<GridRowsProp>([
    { id: 1, element: "Nitrate", ppm: "", percent: "" },
    { id: 2, element: "Ammonium", ppm: "", percent: "" },
    { id: 3, element: "Phosphate", ppm: "", percent: "" },
    { id: 4, element: "Potassium", ppm: "", percent: "" },
    { id: 5, element: "Calcium", ppm: "", percent: "" },
    { id: 6, element: "Magnesium", ppm: "", percent: "" },
    { id: 7, element: "Sulphate", ppm: "", percent: "" },
    { id: 8, element: "Zinc", ppm: "", percent: "" },
    { id: 9, element: "Copper", ppm: "", percent: "" },
    { id: 10, element: "Manganese", ppm: "", percent: "" },
    { id: 11, element: "Iron", ppm: "", percent: "" },
    { id: 12, element: "Boron", ppm: "", percent: "" },
    { id: 13, element: "Molybdenum", ppm: "", percent: "" },
    { id: 14, element: "Chloride", ppm: "", percent: "" },
    { id: 15, element: "Sodium", ppm: "", percent: "" },
    { id: 16, element: "Silicon", ppm: "", percent: "" },
    { id: 17, element: "Aluminium", ppm: "", percent: "" }
  ]);

  // Calculate values whenever rows change
  useEffect(() => {
    // Calculate net charge balance and whilt risk

    setNetChargeBalance(calculateNetChargeBalance([...rows as Row[]]));
    setWhiltRisk(calculateWhiltRiskValue([...rows as Row[]]));
  }, [rows]);

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = (): void => {
    setActiveStep(0);
    setNutrientData({});
    setNetChargeBalance(0);
    setWhiltRisk(0);
    setInputValues({});
    setRows(rows.map((row) => ({ ...row, ppm: "", percent: "" })));
  };

  const handleInputValuesChange = (newValue: { id: number; ppm: number | ""; percent: number | "" }): void => {
    setRows(
      rows.map((value) => {
        if (newValue.id === value.id) {
          return { ...value, ppm: newValue.ppm, percent: newValue.percent };
        } else {
          return value;
        }
      })
    );
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h5" sx={{ mb: 4 }}>
        Crop Compass
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 2 }}>
          <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Button
            color="primary"
            variant="outlined"
            size="large"
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{
              mr: 1,
              px: 2,
              py: 1.5,
              fontSize: "1rem",
              color: 'text.secondary'
            }}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              onClick={handleReset}
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<RestartAltIcon />}
              sx={{
                px: 2,
                py: 1.5,
                fontSize: "1rem",
                color: 'text.secondary'
              }}
            >
              Reset
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="outlined"
              color="primary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 2,
                py: 1.5,
                fontSize: "1rem",
                color: 'text.secondary'
              }}
            >
              Next
            </Button>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 10 }}>
          <Box>
            {activeStep === 0 ? (
              <NutrientInput
                onNext={handleNext}
                onInputValuesChange={handleInputValuesChange}
                onUpload={setRows}
                rows1={rows.slice(0, 9)}
                rows2={rows.slice(9, 17)}
                isDryTissue={isDryTissue}
                onDryTissueChange={setIsDryTissue}
              />
            ) : activeStep === 1 ? (
              <AnalysisView 
                onNext={handleNext} 
                netChargeBalance={netChargeBalance} 
                whiltRisk={whiltRisk}
                isDryTissue={isDryTissue}
              />
            ) : (
              <Recommendations 
                onReset={handleReset} 
                netChargeBalance={netChargeBalance} 
                whiltRisk={whiltRisk}
                isDryTissue={isDryTissue}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
