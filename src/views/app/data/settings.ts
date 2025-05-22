"use client";
import { type SettingsConfig } from "@/blocks/app/Settings";
import { pricing } from "@/pricing";

// General settings configuration
export const generalSettings = {
  headings: {
    accountSettings: "headings.accountSettings",
    generalInformation: "headings.generalInformation"
  },
  labels: {
    name: "labels.name",
    email: "labels.email"
  },
  buttons: {
    saveChanges: "buttons.saveChanges"
  },
  validation: {
    nameRequired: "validation.nameRequired",
    emailRequired: "validation.emailRequired",
    invalidEmail: "validation.invalidEmail"
  },
  placeholders: {
    name: "placeholders.name",
    email: "placeholders.email"
  }
};

// Password settings configuration
export const passwordSettings = {
  headings: {
    password: "headings.password"
  },
  labels: {
    newPassword: "labels.newPassword",
    confirmPassword: "labels.confirmPassword"
  },
  buttons: {
    updatePassword: "buttons.updatePassword"
  },
  validation: {
    passwordRequired: "validation.passwordRequired",
    passwordMinLength: "validation.passwordMinLength",
    confirmPasswordRequired: "validation.confirmPasswordRequired",
    passwordsDoNotMatch: "validation.passwordsDoNotMatch"
  },
  placeholders: {
    newPassword: "placeholders.newPassword",
    confirmPassword: "placeholders.confirmPassword"
  }
};

// Billing settings configuration
export const billingSettings = {
  headings: {
    subscriptionPlans: "headings.subscriptionPlans",
    availablePlans: "headings.availablePlans"
  },
  labels: {
    currentPlan: "labels.currentPlan"
  },
  buttons: {
    upgrade: "buttons.upgrade",
    selectPlan: "buttons.selectPlan",
    billing: "buttons.billing"
  },
  pricing: pricing
};

// Combined settings for backward compatibility
export const settings: SettingsConfig = {
  title: "headings.accountSettings",
  generalSettings,
  passwordSettings,
  billingSettings
};
