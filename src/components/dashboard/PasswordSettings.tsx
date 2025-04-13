"use client";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import LockIcon from "@mui/icons-material/Lock";
import { useAuth } from "@/utils/auth"; // Assuming you have auth context
import CustomInput from "@/components/shared/CustomizedInput";
import FormLabel from "@mui/material/FormLabel";
import Card from "@mui/material/Card";



type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export interface PasswordSettingsConfig {
  headings: {
    password: string;
  };
  labels: {
    newPassword: string;  
    confirmPassword: string;
  };
  buttons: {
    updatePassword: string;
  };
  placeholders: { 
    newPassword: string;
    confirmPassword: string;
  };
  validation: {
    passwordRequired: string;
    passwordMinLength: string;  
    confirmPasswordRequired: string;
    passwordsDoNotMatch: string;
  };
}

export function PasswordSettings({headings, labels, buttons, placeholders, validation}: PasswordSettingsConfig) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<PasswordFormData>();
  const newPassword = watch("newPassword");

  const onSubmit = async (data: PasswordFormData) => {
    if (!user || !('id' in user)) return;
    try {
      // Implement password update logic here
      // You might want to use your auth service for this
      console.log("Updating password", data);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  return (
    <Card sx={{ p: 3, mb: 4 }} >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <LockIcon sx={{ mr: 1, color: "text.secondary" }} />
        <Typography variant="h6" color="text.secondary">{headings.password}</Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid  size={{xs: 12, md: 6}}>
            <FormLabel sx={{ mb: 1, display: "block", color: "text.secondary" }}>{labels.newPassword}</FormLabel>
            <CustomInput
              fullWidth
              placeholder={placeholders.newPassword}
              type="password"
              {...register("newPassword", {
                required: validation.passwordRequired,
                minLength: {
                  value: 8,
                  message: validation.passwordMinLength
                }
              })}
              error={!!errors.newPassword}
            />
          </Grid>
          <Grid  size={{xs: 12, md: 6}}>
            <FormLabel sx={{ mb: 1, display: "block", color: "text.secondary" }}>{labels.confirmPassword}</FormLabel>
            <CustomInput
              fullWidth
              placeholder={placeholders.confirmPassword}
              type="password"
              {...register("confirmPassword", {
                required: validation.confirmPasswordRequired,
                validate: (value) => value === newPassword || validation.passwordsDoNotMatch
              })}
              error={!!errors.confirmPassword}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" variant="outlined" color="primary" sx={{ color: "text.secondary" }}>
            {buttons.updatePassword}
          </Button>
        </Box>
      </form>
    </Card>
  );
}
