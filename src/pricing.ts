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
  footer: string;
  plans: PricingTier[];
}

export const pricing: PricingData = {
  title: "pricing.title",
  description: "pricing.description",
  footer: "pricing.footer",
  notes: ["pricing.notes.0", "pricing.notes.1"],
  plans: [
    {
      id: `price_1R9ndtQeQMvUsn8KSNdLK4yu`,
      title: "pricing.plans.base.title",
      price: "Free",
      period: "",
      recommended: false,
      description: [
        "pricing.plans.base.description.0",
        "pricing.plans.base.description.1",
        "pricing.plans.base.description.2",
        "pricing.plans.base.description.3",
        "pricing.plans.base.description.4"
      ],
      buttonText: "pricing.plans.base.buttonText",
      buttonVariant: "outlined",
      buttonColor: "primary"
    },
    {
      id: `price_1R9qRfQeQMvUsn8KcILO4wL5`,
      title: "pricing.plans.pro.title",
      subheader: "pricing.plans.pro.subheader",
      recommended: true,
      price: "$800",
      period: "per year",
      description: [
        "pricing.plans.pro.description.0",
        "pricing.plans.pro.description.1",
        "pricing.plans.pro.description.2",
        "pricing.plans.pro.description.3",
        "pricing.plans.pro.description.4",
        "pricing.plans.pro.description.5",
        "pricing.plans.pro.description.6",
        "pricing.plans.pro.description.7",
        "pricing.plans.pro.description.8",
        "pricing.plans.pro.description.9",
        "pricing.plans.pro.description.10"
      ],
      buttonText: "pricing.plans.pro.buttonText",
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
