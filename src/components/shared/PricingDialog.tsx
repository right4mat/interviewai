"use client";
import { Dialog, Grid, Button, Container, Typography, Stack, Fade, Slide } from "@mui/material";
import { pricing } from "@/pricing";
import { PAGE_PATH } from "@/path";
import Link from "next/link";
import { useT } from "@/i18n/client";
import { useAuth } from "@/utils/auth";
import { useState } from "react";
import { PricingTierCard } from "./PricingTierCard";
import LoaderOverlay from "./LoaderOverlay";

interface PricingDialogProps {
  onClose?: () => void;
}

export default function PricingDialog({ onClose }: PricingDialogProps) {
  const { t } = useT("pricing");
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) return <LoaderOverlay />;

  return (
    <Dialog
      open={!auth.user || (auth.user && !auth.user?.planIsActive)}
      fullWidth={true}
      fullScreen={true}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
      sx={{
        "& .MuiDialog-paper": {
          bgcolor: "transparent"
        },
        "& .MuiBackdrop-root": {
          bgcolor: "rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(8px)"
        }
      }}
    >
      <Container maxWidth="md">
        <Stack direction="column" spacing={4} alignItems="center" justifyContent="center" height="100%" sx={{ py: 4 }}>
          <Slide direction="down" in={true} timeout={800}>
            <Typography variant="h2" component="h2" gutterBottom textAlign="center">
              {t(pricing.title)}
            </Typography>
          </Slide>
          
          <Fade in={true} timeout={1000}>
            <Typography variant="subtitle1" component="p" textAlign="center">
              {t(pricing.description)}
            </Typography>
          </Fade>
          
          <Grid container spacing={3} justifyContent="center" sx={{ width: "100%" }}>
            {pricing.plans.map((tier, index) => (
              <Fade 
                in={true} 
                timeout={1000} 
                style={{ transitionDelay: `${index * 200}ms` }}
                key={tier.title}
              >
                <Grid 
                  size={{ xs: 12, sm: 6, md: 5 }}
                >
                  <PricingTierCard 
                    tier={tier}
                    onLoadingChange={setIsLoading}
                  />
                </Grid>
              </Fade>
            ))}
          </Grid>

          <Fade in={true} timeout={1000} style={{ transitionDelay: '600ms' }}>
            <Typography variant="subtitle1" component="p" textAlign="center">
              {t(pricing.footer)}
            </Typography>
          </Fade>
          
          <Fade in={true} timeout={1000} style={{ transitionDelay: '800ms' }}>
            {onClose ? (
              <Button onClick={onClose} color="primary">
                {t("dialog.button")}
              </Button>
            ) : (
              <Button component={Link} href={PAGE_PATH.appRoot} color="primary">
                {t("dialog.button")}
              </Button>
            )}
          </Fade>
        </Stack>
      </Container>
    </Dialog>
  );
}