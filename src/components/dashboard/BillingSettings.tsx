"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import { alpha } from "@mui/material/styles";
import PaymentIcon from "@mui/icons-material/Payment";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useAuth } from "@/utils/auth";
import { pricing } from "@/pricing";
import { redirectToBilling, redirectToCheckout } from "@/utils/stripe";
import LoaderOverlay from "@/components/shared/LoaderOverlay";
import { useState } from "react";

interface UserWithCustomData {
  plan?: string;
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

export function BillingSettings({headings, labels, buttons, pricing}: BillingSettingsConfig) {
  const { user } = useAuth();
  const userWithPlan = user as UserWithCustomData | null;
  const currentPlan = userWithPlan?.plan || "Free";
  const [loading, setLoading] = useState(false);
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
      <Card sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <PaymentIcon sx={{ mr: 1, color: "text.secondary" }} />
        <Typography variant="h6" color="text.secondary">{headings.subscriptionPlans}</Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
        {labels.currentPlan} <strong>{currentPlan}</strong>
      </Typography>

      <Typography variant="h6" sx={{ mb: 2 }} color="text.secondary">
        {headings.availablePlans}
      </Typography>

      {sortedPlans.map((plan) => {
        const isCurrentPlan = currentPlan === plan.title;
        const isRecommended = plan.recommended;

        return (
          <Card
            onClick={async () => {
              setLoading(true);
              await redirectToCheckout(plan.id, window.location.pathname, window.location.pathname);
              setLoading(false);
            }}
            key={plan.title}
            variant={isCurrentPlan ? "outlined" : "elevation"}
            sx={{
              p: 2,
              mb: 2,
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.02)" },
              ...(isCurrentPlan && {
                backgroundColor: "rgba(63, 81, 181, 0.05)",
                borderColor: "primary.main"
              }),
              ...(isRecommended && {
                background: (theme) =>
                  `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
                borderLeft: (theme) => `2px solid ${theme.palette.primary.main}`,
                boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
                position: "relative",
                zIndex: 1
              }),
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              "&:last-child": { borderBottom: "none" },
              transition: "all 0.2s ease"
            }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography variant="h6" component="div" sx={isRecommended ? { fontWeight: "medium", color: "primary.dark" } : {}}>
                      {plan.title}
                    </Typography>
                    {isRecommended && (
                      <Chip
                        icon={<AutoAwesomeIcon />}
                        label={plan.subheader}
                        color="primary"
                        size="small"
                        sx={{ ml: 1, fontWeight: "medium" }}
                      />
                    )}
                  </Box>
                  <Typography variant="h6" color={isRecommended ? "primary" : "primary"}>
                    {plan.price}
                    <Typography variant="caption" component="span">
                      /{plan.period.split(" ")[0]}
                    </Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <Button
                  variant={isCurrentPlan ? "contained" : isRecommended ? "contained" : plan.buttonVariant}
                  color={plan.buttonColor}
                  onClick={() => handlePlanChange(plan.title)}
                  disabled={isCurrentPlan}
                  size="small"
                  sx={
                    isRecommended
                      ? {
                          px: 2,
                          fontWeight: "medium",
                          boxShadow: (theme) => `0 2px 6px ${alpha(theme.palette.primary.main, 0.3)}`
                        }
                      : {}
                  }
                >
                  {isRecommended ? buttons.upgrade : buttons.selectPlan}
                </Button>
              </Grid>
            </Grid>
          </Card>
        );
      })}

      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={async () => {
            setLoading(true);
            await redirectToBilling();
            setLoading(false);
          }}
          startIcon={<PaymentIcon />}
          sx={{ color: "text.secondary" }}
        >
          {buttons.billing}
        </Button>
      </Box>
    </Card>
    </>
  );
}
