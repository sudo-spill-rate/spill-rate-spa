const config = {
  API_KEY: import.meta.env.VITE_API_KEY || "feedbackrating_apikey",
  APP_URL: import.meta.env.VITE_APP_URL || "http://localhost:5173",
  VITE_ENV: import.meta.env.VITE_ENV || "development",
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/v1",
};

export default config;