"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { GeneralSettingsConfig, GeneralSettings } from "@/components/app/GeneralSettings";
import { PasswordSettings, PasswordSettingsConfig } from "@/components/app/PasswordSettings";
import  {BillingSettings, BillingSettingsConfig } from "@/components/app/BillingSettings";
import { Container } from "@mui/material";


export interface SettingsConfig {
  title: string;
  generalSettings: GeneralSettingsConfig;
  passwordSettings: PasswordSettingsConfig;
  billingSettings: BillingSettingsConfig;
}

export default function Settings(settings: SettingsConfig) {
  return (
    <Container maxWidth="md">
      <Typography component="h1" variant="h4" sx={{ mb: 4, pt: 2 }}>
        {settings.title}
      </Typography>
      <GeneralSettings {...settings.generalSettings} />
      <PasswordSettings {...settings.passwordSettings} />
      <BillingSettings {...settings.billingSettings} />
    </Container>
  );
}
