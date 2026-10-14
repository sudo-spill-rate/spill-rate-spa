const isBrowser = typeof window !== "undefined";

export const isLocalhost = isBrowser
  ? Boolean(
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "[::1]" ||
      window.location.hostname.endsWith(".localhost")
    )
  : Boolean(import.meta.env.DEV);

export const activeEnv = isLocalhost ? "development" : "production";

export const activeAppUrl = isBrowser
  ? window.location.origin
  : (isLocalhost
      ? import.meta.env.VITE_DEV_APP_URL
      : import.meta.env.VITE_PROD_APP_URL);

const useProdApiOnLocal = import.meta.env.VITE_USE_PROD_API === "true";

export const activeApiUrl = isLocalhost
  ? (useProdApiOnLocal
      ? import.meta.env.VITE_PROD_API_URL
      : (import.meta.env.VITE_DEV_API_URL || import.meta.env.VITE_API_BASE_URL))
  : (import.meta.env.VITE_PROD_API_URL || import.meta.env.VITE_API_BASE_URL);

const config = {
  APP_URL: activeAppUrl,
  VITE_ENV: activeEnv,
  API_URL: activeApiUrl,
  IS_DEV: isLocalhost,
  IS_PROD: !isLocalhost,
};

export default config;