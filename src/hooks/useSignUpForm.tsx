import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useAuth } from "@/utils/auth";
import { AFTER_AUTH_PATH } from "@/path";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useT } from "@/i18n/client";

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  allowExtraEmails: boolean;
}

export const useSignUpForm = (
  onSuccess: (message: string) => void, 
  onError: (message: string) => void,
  captchaRef: React.RefObject<HCaptcha | null>
) => {
  const { t } = useT("auth");
  const captchaToken = useRef<string | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      allowExtraEmails: false
    }
  });

  const password = watch("password");

  const handleSignUp = async (data: SignUpFormData) => {
    try {
      if (!captchaToken.current && !showCaptcha) {
        setShowCaptcha(true);
        captchaRef.current?.execute();
        return;
      }

      await auth.signup(data.email, data.password, captchaToken.current || "");
      onSuccess(t("signup.success"));
      setTimeout(() => {
        router.push(AFTER_AUTH_PATH);
      }, 500);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      onError(errorMessage); //we get error here for first signup as they need to verify email
      console.error("Error signing up:", errorMessage);
    } finally {
      captchaRef.current?.resetCaptcha();
      setShowCaptcha(false);
      captchaToken.current = null;
    }
  };

  const handleSocialSignUp = async (provider: "google" | "facebook") => {
    try {
      await auth.signinWithProvider(provider);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      onError(t(`signup.error.${provider}`, { message: errorMessage }));
      console.error(`Error signing up with ${provider}:`, errorMessage);
    }
  };

  const onVerifyCaptcha = (token: string) => {
    captchaToken.current = token;
    handleSubmit(handleSignUp)();
  };

  const validationRules = {
    email: {
      required: t("signup.validation.email.required"),
      pattern: {
        value: /\S+@\S+\.\S+/,
        message: t("signup.validation.email.invalid")
      }
    },
    password: {
      required: t("signup.validation.password.required"),
      minLength: {
        value: 6,
        message: t("signup.validation.password.minLength")
      }
    },
    confirmPassword: {
      required: t("signup.validation.confirmPassword.required"),
      validate: (value: string) => value === password || t("signup.validation.confirmPassword.mismatch")
    }
  };

  return {
    control,
    errors,
    validationRules,
    handleSignUp: handleSubmit(handleSignUp),
    handleSocialSignUp,
    onVerifyCaptcha,
    showCaptcha,
    setShowCaptcha,
    isPending: auth.isPending
  };
}; 