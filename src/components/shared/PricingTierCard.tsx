import { Box, Button, Card, CardActions, CardContent, Chip, Divider, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { alpha } from "@mui/material/styles";
import { type PricingTier } from "@/types/pricing";
import { useT } from '@/i18n/client';
import { redirectToCheckout } from "@/utils/stripe";
import { CANCEL_STRIPE_PATH, SUCCESS_STRIPE_PATH } from "@/path";

interface PricingTierCardProps {
  tier: PricingTier;
  onLoadingChange: (isLoading: boolean) => void;
}

export function PricingTierCard({ tier, onLoadingChange }: PricingTierCardProps) {
  const { t: tPricing } = useT('pricing');

  return (
    <Card
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        ...(tier.recommended && {
          border: "1px solid",
          borderColor: "primary.main",
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: "primary.main",
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px"
          },
          boxShadow: (theme) => `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`
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
            color: tier.recommended ? "primary.main" : "text.primary"
          }}
        >
          <Typography component="h3" variant="h6">
            {tPricing(tier.title)}
          </Typography>
          {tier.recommended && tier.subheader && (
            <Chip 
              icon={<AutoAwesomeIcon />} 
              label={tPricing(tier.subheader)} 
              color="primary"
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
            color: tier.recommended ? "primary.main" : "text.primary"
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
                color: tier.recommended ? "primary.main" : "primary.main"
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
              {tPricing(line)}
            </Typography>
          </Box>
        ))}
      </CardContent>
      <CardActions>
        <Button
          fullWidth
          variant={tier.buttonVariant}
          color={tier.buttonColor}
          onClick={async () => {
            onLoadingChange(true);
            await redirectToCheckout(tier.id, SUCCESS_STRIPE_PATH, CANCEL_STRIPE_PATH);
            onLoadingChange(false);
          }}
        >
          {tPricing(tier.buttonText)}
        </Button>
      </CardActions>
    </Card>
  );
} 