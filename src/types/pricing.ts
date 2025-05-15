export interface PricingTier {
  id: string;
  title: string;
  price: string;
  period: string;
  description: string[];
  buttonText: string;
  buttonVariant: "outlined" | "contained";
  buttonColor: "primary" | "secondary";
  recommended?: boolean;
  subheader?: string;
} 