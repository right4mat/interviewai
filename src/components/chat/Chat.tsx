"use client";
import { useEffect, type ReactNode } from "react";
import Script from "next/script";
import { usePrevious } from "@/utils/util";
import { useAuth } from "@/utils/auth";
import analytics from "@/utils/analytics";

const config = {
  // Crisp website ID
  crispWebsiteId: process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID,
  // Populate with user name and email
  populateUserInfo: true,
  // Reset conversation history on signout (better privacy on shared computers)
  resetOnSignOut: true,
};

function Chat(): ReactNode | null {
  if (!config.crispWebsiteId) {
    console.warn("Crisp chat is disabled because website ID is not specified");
    return null;
  }

  return (
    <>
      <CrispScript />
      <CrispUpdater />
    </>
  );
}

function CrispScript(): ReactNode {
  return (
    <Script
      id="crisp-widget"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          window.$crisp = [];
          window.CRISP_WEBSITE_ID = "${config.crispWebsiteId}";
          (function () {
            const d = document; 
            const s = d.createElement('script');
            s.src = 'https://client.crisp.chat/l.js';
            s.async = 1;
            d.getElementsByTagName('head')[0].appendChild(s);
          })();
        `,
      }}
    />
  );
}

function CrispUpdater(): null {
  const auth = useAuth();

  // Update Crisp when user data changes
  useEffect(() => {
    if (config.populateUserInfo && auth.user) {
      if (auth.user.email) {
        window.$crisp.push(["set", "user:email", [auth.user.email]]);
      }
      if (auth.user.name) {
        window.$crisp.push(["set", "user:nickname", [auth.user.name]]);
      }
      
      // Track user identification in analytics
      analytics.identify(auth.user.uid, {
        email: auth.user.email,
        name: auth.user.name
      });
    }
  }, [auth.user]);

  // Reset Crisp session when user signs out
  const previousUser = usePrevious(auth.user);
  useEffect(() => {
    // We know the user just signed out if we had a `auth.user` and now we don't
    const didSignOut = previousUser && !auth.user;
    if (config.resetOnSignOut && didSignOut) {
      // Reset Crisp session
      window.$crisp.push(["do", "session:reset"]);
    }
  }, [previousUser, auth.user]);

  return null;
}

// Add TypeScript declaration for $crisp
declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

export default Chat;
