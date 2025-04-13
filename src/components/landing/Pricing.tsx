import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { PricingTier } from "@/views/landing/data/pricing";
import { redirectToCheckout } from "@/utils/stripe";
import LoaderOverlay from "@/components/shared/LoaderOverlay";
import { CANCEL_STRIPE_PATH, SUCCESS_STRIPE_PATH } from "@/path";

export interface PricingConfig {
  title: string;
  description: string;
  plans: PricingTier[];
}

export function Pricing({ title, description, plans }: PricingConfig) {
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
      <Box
        sx={{
          width: { sm: "100%", md: "60%" },
          textAlign: { sm: "left", md: "center" }
        }}
      >
        <Typography component="h2" variant="h4" gutterBottom sx={{ color: "text.primary" }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>
      </Box>
      <Grid container spacing={3} sx={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
        {plans.map((tier: PricingTier) => (
          <Grid size={{ xs: 12, sm: tier.title === "Enterprise" ? 12 : 6, md: 4 }} key={tier.title}>
            <Card
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                ...(tier.recommended && {
                  border: "1px solid",
                  borderColor: "success.main",
                  position: "relative",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    backgroundColor: "success.main",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px"
                  },
                  boxShadow: "0 8px 16px rgba(76, 175, 80, 0.2)"
                })
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    color: tier.recommended ? "success.main" : "text.primary"
                  }}
                >
                  <Typography component="h3" variant="h6">
                    {tier.title}
                  </Typography>
                  {tier.recommended && (
                    <Chip 
                      icon={<AutoAwesomeIcon />} 
                      label={tier.subheader} 
                      color="success"
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "baseline",
                    color: tier.recommended ? "success.main" : "text.primary"
                  }}
                >
                  <Typography component="h3" variant="h2">
                    {tier.price}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "baseline",
                    color: tier.recommended ? "text.primary" : "text.secondary"
                  }}
                >
                  <Typography component="h3" variant="h6">
                    {tier.period}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2, opacity: 0.8, borderColor: "divider" }} />
                {tier.description.map((line) => (
                  <Box key={line} sx={{ py: 1, display: "flex", gap: 1.5, alignItems: "center" }}>
                    <CheckCircleRoundedIcon
                      sx={{
                        width: 20,
                        color: tier.recommended ? "success.main" : "primary.main"
                      }}
                    />
                    <Typography 
                      variant="subtitle2" 
                      component={"span"} 
                      sx={{ 
                        color: tier.recommended ? "text.primary" : "text.secondary",
                        fontWeight: tier.recommended ? "medium" : "regular"
                      }}
                    >
                      {line}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant={tier.buttonVariant as "outlined" | "contained"}
                  color={tier.recommended ? "success" : (tier.buttonColor as "primary" | "secondary")}
                  onClick={async () => {
                    setIsLoading(true);
                    await redirectToCheckout(tier.id, SUCCESS_STRIPE_PATH, CANCEL_STRIPE_PATH);
                    setIsLoading(false);
                  }}
                >
                  {tier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
