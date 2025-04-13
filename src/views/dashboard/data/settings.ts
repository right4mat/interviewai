import { SettingsConfig } from "@/blocks/dashboard/Settings";
import { pricing } from "@/pricing";

// General settings configuration
export const generalSettings = {
  headings: {
    accountSettings: "Account Settings",
    generalInformation: "General Information"
  },
  labels: {
    name: "Name",
    email: "Email"
  },
  buttons: {
    saveChanges: "Save Changes"
  },
  validation: {
    nameRequired: "Name is required",
    emailRequired: "Email is required",
    invalidEmail: "Invalid email address"
  },
  placeholders: {
    name: "Name",
    email: "Email"
  }
};

// Password settings configuration
export const passwordSettings = {
  headings: {
    password: "Password"
  },
  labels: {
    newPassword: "New Password",
    confirmPassword: "Confirm Password"
  },
  buttons: {
    updatePassword: "Update Password"
  },
  validation: {
    passwordRequired: "New password is required",
    passwordMinLength: "Password must be at least 8 characters",
    confirmPasswordRequired: "Please confirm your password",
    passwordsDoNotMatch: "Passwords do not match"
  },
  placeholders: {
    newPassword: "New Password",
    confirmPassword: "Confirm Password"
  }
};

// Billing settings configuration
export const billingSettings = {
  headings: {
    subscriptionPlans: "Subscription Plans",
    availablePlans: "Available Plans"
  },
  labels: {
    currentPlan: "Your current plan:"
  },
  buttons: {
    upgrade: "Upgrade",
    selectPlan: "Select Plan",
    billing: "Billing"
  },
  pricing: pricing
};

// Combined settings for backward compatibility
export const settings: SettingsConfig = {
  title: "Settings",

  generalSettings,
  passwordSettings,
  billingSettings
};
