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
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./ForgotPassword";
import GoogleIcon from "@/images/brandIcons/Google";
import { AFTER_AUTH_PATH, PAGE_PATH } from "@/path";
import { useAuth } from "@/utils/auth";
import { useRouter } from "next/navigation";
import LogoIcon from "@/icons/LogoIcon";
import { useEffect } from "react";
import { useT } from "@/i18n/client";

// Define form data type
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  allowExtraEmails: boolean;
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

export default function SignUpCard(): React.ReactElement {
  const { t } = useT("auth");
  const auth = useAuth();
  const router = useRouter();
  const [open, setOpen] = React.useState<boolean>(false);
  const [alertInfo, setAlertInfo] = React.useState<AlertInfo>({
    show: false,
    message: "",
    severity: "success"
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      allowExtraEmails: false
    }
  });

  useEffect(() => {
    router.prefetch(PAGE_PATH.dashboardPage);
  }, []);

  const password = watch("password");

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      await auth.signup(data.email, data.password);
      setAlertInfo({
        show: true,
        message: t("signup.success"),
        severity: "success"
      });
      setTimeout(() => {
        router.push(AFTER_AUTH_PATH);
      }, 500);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setAlertInfo({
        show: true,
        message: t("signup.error.default", { message: errorMessage }),
        severity: "error"
      });
      console.error("Error signing up:", errorMessage);
    }
  };

  const handleGoogleSignUp = async (): Promise<void> => {
    try {
      await auth.signinWithProvider("google");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setAlertInfo({
        show: true,
        message: t("signup.error.google", { message: errorMessage }),
        severity: "error"
      });
      console.error("Error signing up with Google:", errorMessage);
    }
  };

  const handleFacebookSignUp = async (): Promise<void> => {
    try {
      await auth.signinWithProvider("facebook");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setAlertInfo({
        show: true,
        message: t("signup.error.facebook", { message: errorMessage }),
        severity: "error"
      });
      console.error("Error signing up with Facebook:", errorMessage);
    }
  };

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <LogoIcon />
      </Box>
      <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
        {t("signup.title")}
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
          <FormLabel htmlFor="email">{t("signup.email")}</FormLabel>
          <Controller
            name="email"
            control={control}
            rules={{
              required: t("signup.validation.email.required"),
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: t("signup.validation.email.invalid")
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
          <FormLabel htmlFor="password">{t("signup.password")}</FormLabel>
          <Controller
            name="password"
            control={control}
            rules={{
              required: t("signup.validation.password.required"),
              minLength: {
                value: 6,
                message: t("signup.validation.password.minLength")
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
            rules={{
              required: t("signup.validation.confirmPassword.required"),
              validate: (value) => value === password || t("signup.validation.confirmPassword.mismatch")
            }}
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
        {/*<Controller
          name="allowExtraEmails"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} color="primary" />}
              label={t("signup.allowExtraEmails")}
            />
          )}
        />*/}
        <ForgotPassword open={open} handleClose={handleClose} />
        <Button type="submit" fullWidth variant="contained" disabled={auth.isPending} sx={{ mt: 2 }}>
          {t("signup.buttonAction")}
        </Button>
        <Typography sx={{ textAlign: "center" }}>
          {t("signup.signinText")}{" "}
          <span>
            <Link href={PAGE_PATH.signIn} style={{ textDecoration: 'underline' }}>
              {t("signup.signinAction")}
            </Link>
          </span>
        </Typography>
      </Box>
      <Divider>{t("signup.or")}</Divider>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button fullWidth variant="outlined" onClick={handleGoogleSignUp} startIcon={<GoogleIcon />} disabled={auth.isPending}>
          {t("signup.withGoogle")}
        </Button>
        {/* <Button
          fullWidth
          variant="outlined"
          onClick={handleFacebookSignUp}
          startIcon={<FacebookIcon />}
          disabled={auth.isPending}
        >
          {t("signup.withFacebook")}
        </Button>*/}
      </Box>
    </Card>
  );
}
