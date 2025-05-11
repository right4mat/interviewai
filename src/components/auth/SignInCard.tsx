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
import { styled } from "@mui/material/styles";
import ForgotPassword from "./ForgotPassword";
import GoogleIcon from "@/images/brandIcons/Google";
import { AFTER_AUTH_PATH, PAGE_PATH } from "@/path";
import { useAuth } from "@/utils/auth";
import { useRouter } from "next/navigation";
import LogoIcon from "@/icons/LogoIcon";

// Define form data type
interface FormData {
  email: string;
  password: string;
  remember: boolean;
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
  const [open, setOpen] = React.useState(false);
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Sign in with email/password
      await auth.signin(data.email, data.password);
      // On successful signin, redirect to dashboard
      // Use router.push inside useEffect to ensure it's only called after component is mounted

      router.push(AFTER_AUTH_PATH);
    } catch (error: unknown) {
      // Handle error - you may want to show this to the user
      console.error("Error signing in:", error instanceof Error ? error.message : String(error));
      // You could set an error state here to display to the user
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await auth.signinWithProvider("google");
      // Note: No need to redirect here as it's handled by the provider flow
    } catch (error: unknown) {
      console.error("Error signing in with Google:", error instanceof Error ? error.message : String(error));
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await auth.signinWithProvider("facebook");
      // Note: No need to redirect here as it's handled by the provider flow
    } catch (error: unknown) {
      console.error("Error signing in with Facebook:", error instanceof Error ? error.message : String(error));
    }
  };

  // Use useEffect to handle redirects after authentication
  React.useEffect(() => {
    // Check if user is authenticated before redirecting
    if (auth.user) {
      router.push(AFTER_AUTH_PATH);
    }
  }, [auth.user, router]);

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <LogoIcon />
      </Box>
      <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
        Sign in
      </Typography>
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
            <Link component="button" type="button" onClick={handleClickOpen} variant="body2" sx={{ alignSelf: "baseline" }}>
              Forgot your password?
            </Link>
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
        <Controller
          name="remember"
          control={control}
          render={({ field }) => (
            <FormControlLabel control={<Checkbox {...field} checked={field.value} color="primary" />} label="Remember me" />
          )}
        />
        <ForgotPassword open={open} handleClose={handleClose} />
        <Button type="submit" fullWidth variant="contained">
          Sign in
        </Button>
        <Typography sx={{ textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <span>
            <Link href={PAGE_PATH.signUp} variant="body2" sx={{ alignSelf: "center" }}>
              Sign up
            </Link>
          </span>
        </Typography>
      </Box>
      <Divider>or</Divider>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button fullWidth variant="outlined" onClick={handleGoogleSignIn} startIcon={<GoogleIcon />}>
          Sign in with Google
        </Button>
        {/* <Button
          fullWidth
          variant="outlined"
          onClick={handleFacebookSignIn}
          startIcon={<FacebookIcon />}
        >
          Sign in with Facebook
        </Button>*/}
      </Box>
    </Card>
  );
}
