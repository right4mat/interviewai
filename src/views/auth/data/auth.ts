// @project
import { PAGE_PATH } from "@/path";

export interface AuthConfig {
  signup: {
    title: string;
    buttonAction: string;
    showFooter: boolean;
    signinText: string;
    signinAction: string;
    signinPath: string;
    showAgreement: boolean;
    termsPath: string;
    privacyPolicyPath: string;
  };
  signin: {
    title: string;
    buttonAction: string;
    showFooter: boolean;
    signupAction: string;
    signupPath: string;
    forgotPassAction: string;
    forgotPassPath: string;
  };
  forgotpass: {
    title: string;
    buttonAction: string;
    showFooter: boolean;
    signinText: string;
    signinAction: string;
    signinPath: string;
  };
  changepass: {
    title: string;
    buttonAction: string;
  };
  defaults: {
    providers: string[];
    afterAuthPath: string;
  };
}

export const auth: AuthConfig = {
  signup: {
    // Top Title
    title: "Get yourself an account",
    // Button text
    buttonAction: "Sign up",
    // Footer text and links
    showFooter: true,
    signinText: "Already have an account?",
    signinAction: "Sign in",
    signinPath: PAGE_PATH.signIn,
    // Terms and privacy policy agreement
    showAgreement: true,
    termsPath: PAGE_PATH.termsConditionPage,
    privacyPolicyPath: PAGE_PATH.privacyPolicyPage
  },
  signin: {
    title: "Welcome back",
    buttonAction: "Sign in",
    showFooter: true,
    signupAction: "Create an account",
    signupPath: PAGE_PATH.signUp,
    forgotPassAction: "Forgot Password?",
    forgotPassPath: PAGE_PATH.forgotPass
  },
  forgotpass: {
    title: "Get a new password",
    buttonAction: "Reset password",
    showFooter: true,
    signinText: "Remember it after all?",
    signinAction: "Sign in",
    signinPath: PAGE_PATH.signIn
  },
  changepass: {
    title: "Choose a new password",
    buttonAction: "Change password"
  },
  // Add default configuration
  defaults: {
    providers: ["google", "facebook", "twitter"],
    afterAuthPath: PAGE_PATH.contactPage,
  }
};
