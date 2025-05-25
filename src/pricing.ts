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
  footer: string;
  notes: string[];
  plans: PricingTier[];
}

export const pricing: PricingData = {
  title: "title",
  description: "description",
  footer: "footer",
  notes: ["notes.0", "notes.1"],
  plans: [
    {
      id: `price_1RSUyiQeQMvUsn8Ki6xOEDJP`,
      title: "plans.pro.title",
      subheader: "plans.pro.subheader",
      recommended: true,
      price: "$49",
      period: "per month",
      description: [
        "plans.pro.description.0",
        "plans.pro.description.1",
        "plans.pro.description.2",
        "plans.pro.description.3",
        "plans.pro.description.4",
        "plans.pro.description.5"
      ],
      buttonText: "plans.pro.buttonText",
      buttonVariant: "contained",
      buttonColor: "secondary"
    },
    {
      id: `price_1RSUxRQeQMvUsn8KfDA7WBnr`,
      title: "plans.base.title",
      price: "$99",
      period: "one-time",
      recommended: false,
      description: [
        "plans.base.description.0",
        "plans.base.description.1",
        "plans.base.description.2",
        "plans.base.description.3",
        "plans.base.description.4"
      ],
      buttonText: "plans.base.buttonText",
      buttonVariant: "outlined",
      buttonColor: "primary"
    }
  ]
};
