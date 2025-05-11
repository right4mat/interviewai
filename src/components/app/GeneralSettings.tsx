"use client";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";
import { updateUser } from "@/utils/db";
import { useAuth } from "@/utils/auth"; // Assuming you have auth context
import CustomInput from "@/components/shared/CustomizedInput";
import { Card, FormLabel } from "@mui/material";



type GeneralFormData = {
  name: string;
  email: string;
};

export interface GeneralSettingsConfig {
  headings: {
    generalInformation: string;
  };
  labels: {
    name: string; 
    email: string;
  };
  buttons: {
    saveChanges: string;
  };
  placeholders: {
    name: string;
    email: string;
  };
  validation: {
    nameRequired: string;
    emailRequired: string;
    invalidEmail: string;
  };
}

export function GeneralSettings({headings, labels, buttons, placeholders, validation}: GeneralSettingsConfig) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<GeneralFormData>({
    defaultValues: {
      name: user && 'name' in user ? user.name : "",
      email: user && 'email' in user ? user.email : ""
    }
  });

  const onSubmit = async (data: GeneralFormData) => {
    if (!user || !('id' in user)) return;
    try {
      await updateUser(user.id, data);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Card sx={{ p: 3, mb: 4 }} >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
        <Typography variant="h6" color="text.secondary">{headings.generalInformation}</Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormLabel sx={{ mb: 1, display: "block", color: "text.secondary" }}>{labels.name}</FormLabel>
            <CustomInput fullWidth placeholder={placeholders.name} {...register("name", { required: validation.nameRequired })} error={!!errors.name} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormLabel sx={{ mb: 1, display: "block", color: "text.secondary" }}>{labels.email}</FormLabel>
            <CustomInput
              fullWidth
              placeholder={placeholders.email}
              type="email"
              {...register("email", {
                required: validation.emailRequired,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: validation.invalidEmail
                }
              })}
              error={!!errors.email}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" variant="outlined" startIcon={<SaveIcon />} sx={{ color: "text.secondary" }}>
            {buttons.saveChanges}
          </Button>
        </Box>
      </form>
    </Card>
  );
}
