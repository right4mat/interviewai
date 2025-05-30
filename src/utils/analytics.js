

import Analytics from "analytics";
//@ts-ignore
import googleAnalyticsPlugin from "@analytics/google-analytics";
import Router from "next/router";


//keep as js file to avoid type errors
// Initialize analytics and plugins
// Documentation: https://getanalytics.io
const analytics = Analytics({
  debug: process.env.NODE_ENV !== "production",
  plugins: [
    googleAnalyticsPlugin({
      measurementIds: [process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID],
    }),
  ],
});

// Track initial pageview
if (typeof window !== "undefined") {
  analytics.page();
}

// Track pageview on route change
Router.events.on("routeChangeComplete", (url) => {
  analytics.page();
});

export default analytics;
