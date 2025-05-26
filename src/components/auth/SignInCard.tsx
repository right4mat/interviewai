"use client";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./ForgotPassword";
import GoogleIcon from "@/images/brandIcons/Google";
import { AFTER_AUTH_PATH, PAGE_PATH } from "@/path";
import { useAuth } from "@/utils/auth";
import { useRouter } from "next/navigation";
import LogoIcon from "@/icons/LogoIcon";
import { useEffect } from "react";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { useT } from "@/i18n/client";
import HCaptcha from "@hcaptcha/react-hcaptcha";

// Define form data type
interface FormData {
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
  const [open, setOpen] = React.useState(false);
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  const [alertInfo, setAlertInfo] = React.useState<AlertInfo>({
    show: false,
    message: "",
    severity: "success"
  });
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      remember: false
    }
  });
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.prefetch(PAGE_PATH.dashboardPage);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data: FormData) => {
    try {
      await auth.signin(data.email, data.password, captchaToken || "");
      setAlertInfo({
        show: true,
        message: t("signin.success"),
        severity: "success"
      });
      setTimeout(() => {
        router.push(AFTER_AUTH_PATH);
      }, 500);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setAlertInfo({
        show: true,
        message: t("signin.error.default", { message: errorMessage }),
        severity: "error"
      });
      console.error("Error signing in:", errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await auth.signinWithProvider("google");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setAlertInfo({
        show: true,
        message: t("signin.error.google", { message: errorMessage }),
        severity: "error"
      });
      console.error("Error signing in with Google:", errorMessage);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await auth.signinWithProvider("facebook");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setAlertInfo({
        show: true,
        message: t("signin.error.facebook", { message: errorMessage }),
        severity: "error"
      });
      console.error("Error signing in with Facebook:", errorMessage);
    }
  };

  // Use useEffect to handle redirects after authentication
  React.useEffect(() => {
    // Check if user is authenticated before redirecting
    if (auth.user) {
      router.push("/dashboard");
    }
  }, [auth.user, router]);

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <LogoIcon />
      </Box>
      <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
        {t("signin.title")}
      </Typography>

      <Collapse in={alertInfo.show}>
        <Alert severity={alertInfo.severity} onClose={() => setAlertInfo({ ...alertInfo, show: false })} sx={{ mb: 2 }}>
          {alertInfo.message}
        </Alert>
      </Collapse>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please enter a valid email address"
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
            <FormLabel htmlFor="password">Password</FormLabel>
            <button
              type="button"
              onClick={handleClickOpen}
              style={{ background: "none", border: "none", color: "inherit", textDecoration: "underline", cursor: "pointer" }}
            >
              {t("signin.forgotPassAction")}
            </button>
          </Box>
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long"
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
        <HCaptcha
          sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY as string}
          onVerify={(token: string) => {
            setCaptchaToken(token);
          }}
        />
        {/*<Controller
          name="remember"
          control={control}
          render={({ field }) => (
            <FormControlLabel 
              control={<Checkbox {...field} checked={field.value} color="primary" />} 
              label={t("signin.rememberMe")} 
            />
          )}
        />*/}
        <ForgotPassword open={open} handleClose={handleClose} />
        <Button type="submit" fullWidth variant="contained" disabled={auth.isPending} sx={{ mt: 2 }}>
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
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button fullWidth variant="outlined" onClick={handleGoogleSignIn} startIcon={<GoogleIcon />} disabled={auth.isPending}>
          {t("signin.withGoogle")}
        </Button>
        {/* <Button
          fullWidth
          variant="outlined"
          onClick={handleFacebookSignIn}
          startIcon={<FacebookIcon />}
          disabled={auth.isPending}
        >
          {t("signin.withFacebook")}
        </Button>*/}
      </Box>
    </Card>
  );
}
