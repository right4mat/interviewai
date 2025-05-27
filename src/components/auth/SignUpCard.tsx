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
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { styled } from "@mui/material/styles";
import { PAGE_PATH } from "@/path";
import { useRouter } from "next/navigation";
import LogoIcon from "@/icons/LogoIcon";
import { useT } from "@/i18n/client";
import { Controller } from "react-hook-form";
import { useSignUpForm } from "@/hooks/useSignUpForm";
import { useAlert } from "@/hooks/useAlert";
import SocialLoginButtons from "./SocialLoginButtons";
import HCaptcha from "@hcaptcha/react-hcaptcha";

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

export default function SignUpCard(): React.ReactElement {
  const { t } = useT("auth");
  const router = useRouter();
  const { alertInfo, showAlert, hideAlert } = useAlert();
  const captchaRef = React.useRef<HCaptcha>(null);
  
  const {
    control,
    errors,
    validationRules,
    handleSignUp,
    handleSocialSignUp,
    onVerifyCaptcha,
    isPending
  } = useSignUpForm(
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
        {t("signup.title")}
      </Typography>

      <Collapse in={alertInfo.show}>
        <Alert severity={alertInfo.severity} onClose={hideAlert} sx={{ mb: 2 }}>
          {alertInfo.message}
        </Alert>
      </Collapse>

      <Box
        component="form"
        onSubmit={handleSignUp}
        noValidate
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="email">{t("signup.email")}</FormLabel>
          <Controller
            name="email"
            control={control}
            rules={validationRules.email}
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
          <FormLabel htmlFor="password">{t("signup.password")}</FormLabel>
          <Controller
            name="password"
            control={control}
            rules={validationRules.password}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.password}
                helperText={errors.password?.message}
                type="password"
                id="password"
                placeholder="••••••"
                autoComplete="new-password"
                required
                fullWidth
                variant="outlined"
              />
            )}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="confirmPassword">{t("signup.confirmPassword")}</FormLabel>
          <Controller
            name="confirmPassword"
            control={control}
            rules={validationRules.confirmPassword}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                type="password"
                id="confirmPassword"
                placeholder="••••••"
                autoComplete="new-password"
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
        
        <Button type="submit" fullWidth variant="contained" disabled={isPending} sx={{ mt: 2 }}>
          {t("signup.buttonAction")}
        </Button>
        <Typography sx={{ textAlign: "center" }}>
          {t("signup.signinText")}{" "}
          <span>
            <Link href={PAGE_PATH.signIn} style={{ textDecoration: "underline" }}>
              {t("signup.signinAction")}
            </Link>
          </span>
        </Typography>
      </Box>
      <Divider>{t("signup.or")}</Divider>
      <SocialLoginButtons
        onGoogleSignIn={() => handleSocialSignUp("google")}
        disabled={isPending}
      />
    </Card>
  );
}
