"use client";
import * as React from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Grid,
  LinearProgress,
  Switch,
  FormControlLabel,
  Card
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import CustomizedDataGrid from "@/components/shared/CustomizedDataGrid";
import {
  GridColDef,
  GridRowsProp,
  GridCellParams,
  GridPreProcessEditCellProps,
  GridValidRowModel,
  GridTreeNode,
  GridRenderCellParams,
  GridRowId,
  GridRowModel
} from "@mui/x-data-grid";
import CustomizedInput from "@/components/shared/CustomizedInput";
import { useReportExtraction } from "@/services/cropCompass";

interface NutrientInputProps {
  onNext: () => void;
  onInputValuesChange: (data: { id: number; ppm: number | ""; percent: number | "" }) => void;
  onUpload: (rows: GridRowsProp) => void;
  rows1: GridRowsProp;
  rows2: GridRowsProp;
  isDryTissue: boolean;
  onDryTissueChange: (isDryTissue: boolean) => void;
}

export default function NutrientInput({ onInputValuesChange, rows1, rows2, onUpload, onNext, isDryTissue, onDryTissueChange }: NutrientInputProps): React.ReactElement {
  const [inputMethod, setInputMethod] = React.useState<number>(0);
  const reportExtraction = useReportExtraction();

  const handleInputMethodChange = (event: React.SyntheticEvent, newValue: number): void => {
    setInputMethod(newValue);
  };

  const handleDryTissueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDryTissueChange(event.target.checked);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const result = await reportExtraction.mutateAsync(file);
        console.log("API Response:", result);

        if (result) {
          // Switch to manual input tab to show the updated data
          setInputMethod(1);
          onUpload(result);
        } else {
          console.error("Invalid response format:", result);
        }
      } catch (error) {
        console.error("Error extracting data from file:", error);
      }
    }
  };

  const handleCellValueChange = (field: string, params: GridPreProcessEditCellProps): void => {
    // Create an object with the correct structure expected by onInputValuesChange
    onInputValuesChange({
      ...params.row,
      [field]: params.props.value
    });
  };

  const gridColumns: GridColDef[] = [
    { field: "element", headerName: "Element", width: 150, editable: false },
    {
      field: "ppm",
      headerName: "PPM",
      width: 150,
      editable: true,
      type: "number",
      renderCell: (params: GridRenderCellParams) => {
        return <CustomizedInput value={params.value} disabled={Boolean(params.row.percent)} />;
      },
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasPercent = Boolean(params.row.percent);
        if (hasPercent) {
          return { ...params.props, error: true };
        }
        handleCellValueChange("ppm", params);
        return { ...params.props };
      }
    },
    {
      field: "percent",
      headerName: "%",
      width: 150,
      editable: true,
      type: "number",
      renderCell: (params: GridRenderCellParams) => {
        return <CustomizedInput value={params.value} disabled={Boolean(params.row.ppm)} />;
      },
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasPpm = Boolean(params.row.ppm);
        if (hasPpm) {
          return { ...params.props, error: true };
        }
        handleCellValueChange("percent", params);
        return { ...params.props };
      }
    }
  ];

  return (
    <>
      <Card sx={{ p: 3, mb: 3, }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <InfoIcon color="primary" sx={{ mr: 2, mt: 0.5 }} />
          <Box>
            <Typography variant="h6" gutterBottom>
              Nutrient Data Input
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Enter your plant tissue analysis data to generate crop compass recommendations. You can either upload a lab report file for automatic extraction or manually input the values. For each nutrient, enter either PPM or percentage values.
            </Typography>
          </Box>
        </Box>
        <FormControlLabel
          control={
            <Switch 
              checked={isDryTissue}
              onChange={handleDryTissueChange}
              color="primary"
            />
          }
          label="Dry Tissue Analysis"
          sx={{ mt: 1 }}
        />
        <Typography variant="caption" display="block" color="text.secondary">
          {isDryTissue ? 
            "Analyzing dry tissue samples" : 
            "Analyzing sap samples"}
        </Typography>
      </Card>

  

      <Tabs value={inputMethod} onChange={handleInputMethodChange} aria-label="data input method" sx={{ mb: 3 }}>
        <Tab icon={<CloudUploadIcon />} label="File Upload" />
        <Tab icon={<EditIcon />} label="Manual Input" />
      </Tabs>

      {inputMethod === 0 ? (
        <Box sx={{ p: 2, border: "1px dashed grey", borderRadius: 1, textAlign: "center" }}>
          <input
            accept=".jpg,.jpeg,.png"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="raised-button-file">
            <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} size="large" disabled={reportExtraction.isPending} sx={{color: 'text.secondary'}}>
              {reportExtraction.isPending ? "Processing..." : "Upload Nutrient Data File"}
            </Button>
          </label>
          <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
            Supported formats: JPG, PNG
          </Typography>
          {reportExtraction.isPending && (
            <Box sx={{ width: "100%", mt: 2 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Extracting data from your file...
              </Typography>
            </Box>
          )}
          {reportExtraction.isError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              Error processing file. Please try again.
            </Typography>
          )}
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomizedDataGrid
              rows={rows1 as GridValidRowModel[]}
              columns={gridColumns}
              pageSize={10}
              checkboxSelection={false}
              disableColumnResize={true}
              density="standard"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomizedDataGrid
              rows={rows2 as GridValidRowModel[]}
              columns={gridColumns}
              pageSize={10}
              checkboxSelection={false}
              disableColumnResize={true}
              density="standard"
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}
