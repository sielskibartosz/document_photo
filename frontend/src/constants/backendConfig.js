// config.js
export const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://api.photoidcreator.com";
