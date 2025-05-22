"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { GeneralSettings, type GeneralSettingsConfig } from "@/components/app/GeneralSettings";
import { PasswordSettings, type PasswordSettingsConfig } from "@/components/app/PasswordSettings";
import  {BillingSettings, type BillingSettingsConfig } from "@/components/app/BillingSettings";
import { Container } from "@mui/material";
import { useT } from "@/i18n/client";
import { settings } from "@/views/app/data/settings";


export interface SettingsConfig {
  title: string;
  generalSettings: GeneralSettingsConfig;
  passwordSettings: PasswordSettingsConfig;
  billingSettings: BillingSettingsConfig;
}

export default function Settings(settings: SettingsConfig) {
  const { t } = useT('settings');
  return (
    <Container maxWidth="md">
      <Typography component="h1" variant="h4" sx={{ mb: 4, pt: 2 }}>
        {t("headings.accountSettings")}
      </Typography>
      <GeneralSettings {...settings.generalSettings} />
      <PasswordSettings {...settings.passwordSettings} />
      <BillingSettings {...settings.billingSettings} />
    </Container>
  );
}
