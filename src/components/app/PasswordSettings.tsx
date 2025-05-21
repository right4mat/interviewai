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
import useToast from "@/hooks/useToast";
import { useT } from "@/i18n/client";

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

export function PasswordSettings({ headings, labels, buttons, placeholders, validation }: PasswordSettingsConfig) {
  const { user, updatePassword, isPending, error } = useAuth();
  const { addToast } = useToast();
  const { t } = useT("settings");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError
  } = useForm<PasswordFormData>();
  const newPassword = watch("newPassword");

  const onSubmit = async (data: PasswordFormData) => {
    if (!user || !("id" in user)) return;
    try {
      await updatePassword(data.newPassword);
      // Reset form after successful update
      reset();
      addToast("Your password has been updated successfully", "success");
    } catch (err: any) {
      // Set form error if auth error occurs
      setError("newPassword", {
        type: "manual",
        message: err.message
      });
      addToast(err.message, "error");
      console.error("Error updating password:", err);
    }
  };

  return (
    <Card sx={{ p: 3, mb: 4, backgroundColor: "background.card" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <LockIcon sx={{ mr: 1, color: "text.secondary" }} />
        <Typography variant="h6" color="text.secondary">
          {t(headings.password)}
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormLabel sx={{ mb: 1, display: "block", color: "text.secondary" }}>{t(labels.newPassword)}</FormLabel>
            <CustomInput
              fullWidth
              placeholder={t(placeholders.newPassword)}
              type="password"
              {...register("newPassword", {
                required: t(validation.passwordRequired),
                minLength: {
                  value: 8,
                  message: t(validation.passwordMinLength)
                }
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormLabel sx={{ mb: 1, display: "block", color: "text.secondary" }}>{t(labels.confirmPassword)}</FormLabel>
            <CustomInput
              fullWidth
              placeholder={t(placeholders.confirmPassword)}
              type="password"
              {...register("confirmPassword", {
                required: t(validation.confirmPasswordRequired),
                validate: (value) => value === newPassword || t(validation.passwordsDoNotMatch)
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained" color="primary" disabled={isPending}>
            {t(buttons.updatePassword)}
          </Button>
        </Box>
      </form>
    </Card>
  );
}
