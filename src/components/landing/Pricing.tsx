"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LoaderOverlay from "@/components/shared/LoaderOverlay";
import { useT } from '@/i18n/client';
import { type PricingTier } from "@/types/pricing";
import { PricingTierCard } from "@/components/shared/PricingTierCard";

export function Pricing({ plans, hideHeader = false }: any) {
  const { t: tPricing } = useT('pricing');
  const [isLoading, setIsLoading] = useState(false);
  
  if (isLoading) return <LoaderOverlay />;

  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 3, sm: 6 }
      }}
    >
      {!hideHeader && <Box
        sx={{
          width: { sm: "100%", md: "60%" },
          textAlign: { sm: "left", md: "center" }
        }}
      >
        <Typography component="h2" variant="h4" gutterBottom sx={{ color: "text.primary" }}>
          {tPricing('title')}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {tPricing('description')}
        </Typography>
      </Box>}
      <Grid container spacing={3} sx={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
        {plans.map((tier: PricingTier) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tier.title}>
            <PricingTierCard 
              tier={tier}
              onLoadingChange={setIsLoading}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
