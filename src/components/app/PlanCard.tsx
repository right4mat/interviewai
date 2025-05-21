"use client";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useT } from "@/i18n/client";

interface PlanCardProps {
  plan: {
    id: string;
    title: string;
    price: string;
    period: string;
    recommended?: boolean;
    subheader?: string;
    buttonVariant?: "text" | "outlined" | "contained";
    buttonColor?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  };
  isCurrentPlan: boolean;
  onPlanChange: (planId: string) => void;
  onCardClick: () => void;
  buttons: {
    upgrade: string;
    selectPlan: string;
  };
}

export function PlanCard({ plan, isCurrentPlan, onPlanChange, onCardClick, buttons }: PlanCardProps) {
  const { t: tPricing } = useT("pricing");
  const isRecommended = plan.recommended;

  return (
    <Card
      onClick={onCardClick}
      variant={isCurrentPlan ? "outlined" : "elevation"}
      sx={{
        p: 2,
        mb: 2,
        cursor: "pointer",
        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.02)" },
        ...(isCurrentPlan && {
          backgroundColor: (theme) => alpha(theme.palette.success.main, 0.05),
          borderColor: "success.main",
          position: "relative"
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
                {tPricing(plan.title)}
              </Typography>
              {isRecommended && plan.subheader && (
                <Chip
                  icon={<AutoAwesomeIcon />}
                  label={tPricing(plan.subheader as string)}
                  color="primary"
                  size="small"
                  sx={{ ml: 1, fontWeight: "medium" }}
                />
              )}
              {isCurrentPlan && <Chip label={tPricing("currentPlan")} color="success" size="small" sx={{ ml: 1, fontWeight: "medium" }} />}
            </Box>
            <Typography variant="h6" color={isRecommended ? "primary" : "primary"}>
              {plan.price}
              <Typography variant="caption" component="span">
                /{plan.period}
              </Typography>
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <Button
            variant={isCurrentPlan ? "contained" : isRecommended ? "contained" : plan.buttonVariant}
            color={isCurrentPlan ? "success" : plan.buttonColor}
            onClick={() => onPlanChange(plan.title)}
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
            {isCurrentPlan ? tPricing("currentPlan") : isRecommended ? tPricing(buttons.upgrade) : tPricing(buttons.selectPlan)}
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
} 