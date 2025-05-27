import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import GoogleIcon from "@/images/brandIcons/Google";
import { useT } from "@/i18n/client";

interface SocialLoginButtonsProps {
  onGoogleSignIn: () => void;
  disabled?: boolean;
}

export default function SocialLoginButtons({ onGoogleSignIn, disabled }: SocialLoginButtonsProps) {
  const { t } = useT("auth");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Button 
        fullWidth 
        variant="outlined" 
        onClick={onGoogleSignIn} 
        startIcon={<GoogleIcon />} 
        disabled={disabled}
      >
        {t("signin.withGoogle")}
      </Button>
    </Box>
  );
} 