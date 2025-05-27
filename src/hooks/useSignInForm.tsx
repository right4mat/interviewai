import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useAuth } from "@/utils/auth";
import { AFTER_AUTH_PATH } from "@/path";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useT } from "@/i18n/client";

interface SignInFormData {
  email: string;
  password: string;
  remember: boolean;
}

export const useSignInForm = (
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
    formState: { errors }
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
      remember: false
    }
  });

  const handleSignIn = async (data: SignInFormData) => {
    try {
      if (!captchaToken.current && !showCaptcha) {
        setShowCaptcha(true);
        captchaRef.current?.execute();
        return;
      }

      await auth.signin(data.email, data.password, captchaToken.current || "");
      onSuccess(t("signin.success"));
      setTimeout(() => {
        router.push(AFTER_AUTH_PATH);
      }, 500);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      onError(t("signin.error.default", { message: errorMessage }));
      console.error("Error signing in:", errorMessage);
    } finally {
      captchaRef.current?.resetCaptcha();
      setShowCaptcha(false);
      captchaToken.current = null;
    }
  };

  const handleSocialSignIn = async (provider: "google" | "facebook") => {
    try {
      await auth.signinWithProvider(provider);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      onError(t(`signin.error.${provider}`, { message: errorMessage }));
      console.error(`Error signing in with ${provider}:`, errorMessage);
    }
  };

  const onVerifyCaptcha = (token: string) => {
    captchaToken.current = token;
    handleSubmit(handleSignIn)();
  };

  return {
    control,
    errors,
    handleSignIn: handleSubmit(handleSignIn),
    handleSocialSignIn,
    onVerifyCaptcha,
    showCaptcha,
    setShowCaptcha,
    isPending: auth.isPending
  };
};
