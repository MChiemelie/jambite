import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://658cf42a96e8980bdfa40913c3fdec97@o4510203345829889.ingest.de.sentry.io/4510203347402832",
  enableLogs: true,
  sendDefaultPii: true,
});
