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
    title: "signup.title",
    buttonAction: "signup.buttonAction",
    showFooter: true,
    signinText: "signup.signinText",
    signinAction: "signup.signinAction",
    signinPath: PAGE_PATH.signIn,
    showAgreement: true,
    termsPath: PAGE_PATH.termsConditionPage,
    privacyPolicyPath: PAGE_PATH.privacyPolicyPage
  },
  signin: {
    title: "signin.title",
    buttonAction: "signin.buttonAction",
    showFooter: true,
    signupAction: "signin.signupAction",
    signupPath: PAGE_PATH.signUp,
    forgotPassAction: "signin.forgotPassAction",
    forgotPassPath: PAGE_PATH.forgotPass
  },
  forgotpass: {
    title: "forgotpass.title",
    buttonAction: "forgotpass.buttonAction",
    showFooter: true,
    signinText: "forgotpass.signinText",
    signinAction: "forgotpass.signinAction",
    signinPath: PAGE_PATH.signIn
  },
  changepass: {
    title: "changepass.title",
    buttonAction: "changepass.buttonAction"
  },
  defaults: {
    providers: ["google", "facebook", "twitter"],
    afterAuthPath: PAGE_PATH.contactPage,
  }
};
