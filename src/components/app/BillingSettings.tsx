"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import PaymentIcon from "@mui/icons-material/Payment";
import { useAuth } from "@/utils/auth";
import { pricing } from "@/pricing";
import { redirectToBilling, redirectToCheckout } from "@/utils/stripe";
import LoaderOverlay from "@/components/shared/LoaderOverlay";
import { useState } from "react";
import { useT } from "@/i18n/client";
import { PlanCard } from "./PlanCard";

interface UserWithCustomData {
  planId?: string;
  // other user properties
}

export interface BillingSettingsConfig {
  headings: {
    subscriptionPlans: string;
    availablePlans: string;
  };
  labels: {
    currentPlan: string;
  };
  buttons: {
    upgrade: string;
    selectPlan: string;
    billing: string;
  };
  pricing: typeof pricing;
}

export function BillingSettings({ headings, labels, buttons, pricing }: BillingSettingsConfig) {
  const { user } = useAuth();
  const { t } = useT("settings");
  const { t: tPricing } = useT("pricing");
  const userWithPlan = user as UserWithCustomData | null;
  const [loading, setLoading] = useState(false);

  // Find the current plan title based on the user's planId
  const currentPlanTitle = userWithPlan?.planId ? pricing.plans.find((plan) => plan.id === userWithPlan.planId)?.title || "" : "";

  const handlePlanChange = async (planId: string) => {
    if (!user) return;
    try {
      console.log("Changing to plan:", planId);
      // Implementation for checkout or payment modal would go here
    } catch (error) {
      console.error("Error changing plan:", error);
    }
  };

  if (loading) {
    return <LoaderOverlay />;
  }

  // Sort plans to ensure recommended plan is at the top
  const sortedPlans = [...pricing.plans].sort((a, b) => {
    if (a.recommended && !b.recommended) return -1;
    if (!a.recommended && b.recommended) return 1;
    return 0;
  });

  return (
    <>
      <Card sx={{ p: 3, backgroundColor: "background.card" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <PaymentIcon sx={{ mr: 1, color: "text.secondary" }} />
          <Typography variant="h6" color="text.secondary">
            {t(headings.subscriptionPlans)}
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
          {t(labels.currentPlan)} <strong>{tPricing(currentPlanTitle)}</strong>
        </Typography>

        <Typography variant="h6" sx={{ mb: 2 }} color="text.secondary">
          {t(headings.availablePlans)}
        </Typography>

        {sortedPlans.map((plan) => {
          const isCurrentPlan = userWithPlan?.planId === plan.id;

          return (
            <PlanCard
              key={plan.title}
              plan={plan}
              isCurrentPlan={isCurrentPlan}
              onPlanChange={handlePlanChange}
              onCardClick={async () => {
                if (isCurrentPlan) return;
                setLoading(true);
                await redirectToCheckout(plan.id, window.location.href, window.location.href);
                setLoading(false);
              }}
              buttons={{
                upgrade: buttons.upgrade,
                selectPlan: buttons.selectPlan
              }}
            />
          );
        })}

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={async () => {
              setLoading(true);
              await redirectToBilling();
              setLoading(false);
            }}
            startIcon={<PaymentIcon />}
          >
            {t(buttons.billing)}
          </Button>
        </Box>
      </Card>
    </>
  );
}
