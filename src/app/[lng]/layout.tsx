import PropTypes from "prop-types";
import Script from "next/script";
import { ReactNode } from "react";
// @style
import "./globals.css";

// @mui
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

// @project
import ProviderWrapper from "./ProviderWrapper";
import { mainMetadata } from "@/metadata";
import ThemeProvider from "@/components/theme/ThemeProvider";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import Chat from "@/components/chat/Chat";
import { ToastContainer } from "react-toastify";
import { languages } from '../../i18n/settings'

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

// @types

const gaId = process.env.NEXT_PUBLIC_ANALYTICS_ID || "";

/***************************  METADATA - MAIN  ***************************/

export const metadata = { ...mainMetadata };

/***************************  LAYOUT - MAIN  ***************************/

// Root layout component that wraps the entire application
export default function RootLayout({ children }: { children: ReactNode }) {
  console.log("RootLayout");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect and DNS Prefetch */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
      </head>
      <body>
        <InitColorSchemeScript attribute="class" />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider>
            <ProviderWrapper>
           {   /*<Chat />*/}
              {children}
              <ToastContainer />
            </ProviderWrapper>
          </ThemeProvider>
        </AppRouterCacheProvider>
        {gaId && <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />}
      </body>
    </html>
  );
}

RootLayout.propTypes = { children: PropTypes.any };
