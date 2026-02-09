// config.js
export const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "http://46.225.109.176:8080";
