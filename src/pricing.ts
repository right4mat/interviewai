export interface PricingTier {
  id: string;
  title: string;
  subheader?: string;
  recommended: boolean;
  price: string;
  period: string;
  description: string[];

  buttonText: string;
  buttonVariant: "outlined" | "contained";
  buttonColor: "primary" | "secondary";
}

export interface PricingData {
  title: string;
  description: string;
  notes: string[];
  plans: PricingTier[];
}

export const pricing: PricingData = {
  title: "Crop Nutrition Compass Plans",
  description: "Choose the plan that fits your agricultural management needs",
  notes: [
    "* All plans include a 14-day free trial. You can cancel anytime.",
    "* For custom enterprise plans, please contact our sales team."
  ],
  plans: [
    {
      id: `price_1R9ndtQeQMvUsn8KSNdLK4yu`,
      title: "BASE",
      price: "Free",
      period: "",
      recommended: false,
      description: [
        "Number of Fields: 1",
        "Sap Analysis Reports: 1",
        "Basic Nutrient Recommendations",
        "Seasonal Planning",
        "Yield Tracking"
      ],
      buttonText: "Current Plan",
      buttonVariant: "outlined",
      buttonColor: "primary"
    },
    {
      id: `price_1R9qRfQeQMvUsn8KcILO4wL5`,
      title: "PRO",
      subheader: "Recommended",
      recommended: true,
      price: "$800",
      period: "per year",
      description: [
        "Number of Fields: Unlimited",
        "Sap Analysis Reports: Unlimited",
        "Advanced Nutrient Recommendations",
        "Seasonal Planning",
        "Yield Tracking",
        "Fertilizer Optimization",
        "Crop Rotation Planner",
        "Sustainability Metrics",
        "Historical Data Analysis",
        "Export Reports",
        "Priority Support"
      ],
      buttonText: "Select",
      buttonVariant: "contained",
      buttonColor: "secondary"
    }
    /*{
      title: 'Enterprise',
      price: 'Contact us',
      period: '',
      recommended: false,
      description: [
        'All Pro features',
        'Custom integrations',
        'Dedicated support team',
        'Priority phone & email support',
      ],
      buttonText: 'Contact us',
      buttonVariant: 'outlined',
      buttonColor: 'primary',
    },*/
  ]
};
