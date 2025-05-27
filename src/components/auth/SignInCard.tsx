"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./ForgotPassword";
import { PAGE_PATH } from "@/path";
import { useRouter } from "next/navigation";
import LogoIcon from "@/icons/LogoIcon";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { useT } from "@/i18n/client";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Controller } from "react-hook-form";
import { useSignInForm } from "@/hooks/useSignInForm";
import { useAlert } from "@/hooks/useAlert";
import SocialLoginButtons from "./SocialLoginButtons";

// Define form data type
interface SignInFormData {
  email: string;
  password: string;
  remember: boolean;
}

// Define alert info type
interface AlertInfo {
  show: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

interface UseAlertReturn {
  alertInfo: AlertInfo;
  showAlert: (message: string, severity: AlertInfo["severity"]) => void;
  hideAlert: () => void;
}

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow: "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px"
  },
  ...theme.applyStyles("dark", {
    boxShadow: "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px"
  })
}));

export default function SignInCard() {
  const { t } = useT("auth");
  const [forgotPasswordOpen, setForgotPasswordOpen] = React.useState(false);
  const router = useRouter();
  const { alertInfo, showAlert, hideAlert } = useAlert();
  const captchaRef = React.useRef<HCaptcha>(null);
  
  const {
    control,
    errors,
    handleSignIn,
    handleSocialSignIn,
    onVerifyCaptcha,
    showCaptcha,
    isPending
  } = useSignInForm(
    (message) => showAlert(message, "success"),
    (error) => showAlert(error, "error"),
    captchaRef
  );

  React.useEffect(() => {
    router.prefetch(PAGE_PATH.dashboardPage);
  }, [router]);

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <LogoIcon />
      </Box>
      <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
        {t("signin.title")}
      </Typography>

      <Collapse in={alertInfo.show}>
        <Alert severity={alertInfo.severity} onClose={hideAlert} sx={{ mb: 2 }}>
          {alertInfo.message}
        </Alert>
      </Collapse>

      <Box
        component="form"
        onSubmit={handleSignIn}
        noValidate
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="email">{t("signin.email")}</FormLabel>
          <Controller
            name="email"
            control={control}
            rules={{
              required: t("signin.validation.email.required"),
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: t("signin.validation.email.invalid")
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.email}
                helperText={errors.email?.message}
                id="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
              />
            )}
          />
        </FormControl>
        <FormControl>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <FormLabel htmlFor="password">{t("signin.password")}</FormLabel>
            <button
              type="button"
              onClick={() => setForgotPasswordOpen(true)}
              style={{ background: "none", border: "none", color: "inherit", textDecoration: "underline", cursor: "pointer" }}
            >
              {t("signin.forgotPassAction")}
            </button>
          </Box>
          <Controller
            name="password"
            control={control}
            rules={{
              required: t("signin.validation.password.required"),
              minLength: {
                value: 6,
                message: t("signin.validation.password.minLength")
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.password}
                helperText={errors.password?.message}
                type="password"
                id="password"
                placeholder="••••••"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
              />
            )}
          />
        </FormControl>
        <Box>
          <HCaptcha
            ref={captchaRef}
            size="invisible"
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY as string}
            onVerify={onVerifyCaptcha}
            onExpire={() => {
              captchaRef.current?.resetCaptcha();
            }}
          />
        </Box>
        
        <Button 
          type="submit" 
          fullWidth 
          variant="contained" 
          disabled={isPending || showCaptcha} 
          sx={{ mt: 2 }}
        >
          {t("signin.buttonAction")}
        </Button>
        <Typography sx={{ textAlign: "center" }}>
          {t("signin.signupText")}{" "}
          <span>
            <Link href={PAGE_PATH.signUp} style={{ textDecoration: "underline" }}>
              {t("signin.signupAction")}
            </Link>
          </span>
        </Typography>
      </Box>
      <Divider>{t("signin.or")}</Divider>
      <SocialLoginButtons
        onGoogleSignIn={() => handleSocialSignIn("google")}
        disabled={isPending}
      />
      <ForgotPassword 
        open={forgotPasswordOpen} 
        handleClose={() => setForgotPasswordOpen(false)} 
      />
    </Card>
  );
}
