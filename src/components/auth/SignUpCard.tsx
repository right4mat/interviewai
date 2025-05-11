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
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./ForgotPassword";
import GoogleIcon from "@/images/brandIcons/Google";
import { PAGE_PATH, AFTER_AUTH_PATH } from "@/path";
import { useAuth } from "@/utils/auth";
import { useRouter } from "next/navigation";
import LogoIcon from "@/icons/LogoIcon";

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

  const password = watch("password");

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      // Sign up with email/password
      await auth.signup(data.email, data.password);
      // Show success message
      setAlertInfo({
        show: true,
        message: "Account created successfully!",
        severity: "success"
      });
      // On successful signup, redirect to dashboard
      // Only redirect if router is ready to prevent "NextRouter was not mounted" error

      setTimeout(() => {
        router.push(AFTER_AUTH_PATH);
      }, 500);
    } catch (error: unknown) {
      // Handle error - show to the user
      setAlertInfo({
        show: true,
        message: `Error signing up: ${error instanceof Error ? error.message : String(error)}`,
        severity: "error"
      });
      console.error("Error signing up:", error instanceof Error ? error.message : String(error));
    }
  };

  const handleGoogleSignUp = async (): Promise<void> => {
    try {
      await auth.signinWithProvider("google");
      // Note: No need to redirect here as it's handled by the provider flow
    } catch (error: unknown) {
      setAlertInfo({
        show: true,
        message: `Error signing up with Google: ${error instanceof Error ? error.message : String(error)}`,
        severity: "error"
      });
      console.error("Error signing up with Google:", error instanceof Error ? error.message : String(error));
    }
  };

  const handleFacebookSignUp = async (): Promise<void> => {
    try {
      await auth.signinWithProvider("facebook");
      // Note: No need to redirect here as it's handled by the provider flow
    } catch (error: unknown) {
      setAlertInfo({
        show: true,
        message: `Error signing up with Facebook: ${error instanceof Error ? error.message : String(error)}`,
        severity: "error"
      });
      console.error("Error signing up with Facebook:", error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <LogoIcon />
      </Box>
      <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
        Sign up
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
          <FormLabel htmlFor="password">Password</FormLabel>
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
                autoComplete="new-password"
                required
                fullWidth
                variant="outlined"
              />
            )}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match"
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
        <Controller
          name="allowExtraEmails"
          control={control}
          render={({ field }) => (
            <FormControlLabel control={<Checkbox {...field} checked={field.value} color="primary" />} label="Allow extra emails" />
          )}
        />
        <ForgotPassword open={open} handleClose={handleClose} />
        <Button type="submit" fullWidth variant="contained">
          Sign up
        </Button>
        <Typography sx={{ textAlign: "center" }}>
          Already have an account?{" "}
          <span>
            <Link href={PAGE_PATH.signIn} variant="body2" sx={{ alignSelf: "center" }}>
              Sign in
            </Link>
          </span>
        </Typography>
      </Box>
      <Divider>or</Divider>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button fullWidth variant="outlined" onClick={handleGoogleSignUp} startIcon={<GoogleIcon />}>
          Sign up with Google
        </Button>
        {/* <Button
          fullWidth
          variant="outlined"
          onClick={handleFacebookSignUp}
          startIcon={<FacebookIcon />}
        >
          Sign up with Facebook
        </Button>*/}
      </Box>
    </Card>
  );
}
