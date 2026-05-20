import dotenv from "dotenv";

dotenv.config();

const requiredKeys = [
  "GROQ_API_KEY",
];

const missingKeys = requiredKeys.filter((key) => !process.env[key]);

if (missingKeys.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingKeys.join(", ")}.` +
      " Please add them to your .env file or deployment environment."
  );
}

export const ENV = process.env.NODE_ENV || "development";
export const PORT = Number(process.env.PORT || 5000);
export const API_ORIGIN = process.env.API_ORIGIN || "http://localhost:5000";
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
export const GROQ_API_KEY = process.env.GROQ_API_KEY;
