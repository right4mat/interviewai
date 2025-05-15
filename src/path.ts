function path(urlChunks: string[]): string {
  return urlChunks.join("/");
}

export const ADMIN_PATH = "#";
export const BUY_NOW_URL = "#";
export const FREEBIES_URL = "#";
export const DOCS_URL = "#";
const AUTH_PATH = "/auth";
const DASHBOARD_PATH = "/app";
export const AFTER_AUTH_PATH = "/app";
export const CANCEL_STRIPE_PATH = "/#pricing";
export const SUCCESS_STRIPE_PATH = "/app";
export const BILLING_PATH = "/settings";
export const FARM_PATH = "farm/";
export const BLOCK_PATH = "/block/";

export const PAGE_PATH = {
  // auth pages path
  signIn: path([AUTH_PATH, "signin"]),
  forgotPass: path([AUTH_PATH, "forgotpass"]),
  changePass: path([AUTH_PATH, "changepass"]),
  otpVerification: path([AUTH_PATH, "otp-verification"]),
  signUp: path([AUTH_PATH, "signup"]),
  // dashboard pages path
  dashboardPage: path([DASHBOARD_PATH]),
  appRoot: path([DASHBOARD_PATH]),
  settingsPage: path([DASHBOARD_PATH, "settings"]),
  usersPage: path([DASHBOARD_PATH, "users"]),
  tasksPage: path([DASHBOARD_PATH, "tasks"]),

  // farm pages path
  farmsPage: path([DASHBOARD_PATH, FARM_PATH]),
  createReportsPage: '/create-reports',

  aboutPage: "/about",
  feedbackPage: "/feedback",
  // pages path

  careerPage: "/career",
  contactPage: "/contact",
  faqPage: "/faq",
  pricingPage: "/#pricing",
  privacyPolicyPage: "/privacy-policy",
  termsConditionPage: "/terms-condition",
  homePage: "/",
  error404: "/404",
  error500: "/500",
  underMaintenance: "/under-maintenance",
  comingSoon: "/coming-soon"
};
