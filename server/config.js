import dotenv from "dotenv";

dotenv.config();

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

export const config = {
  port: Number(process.env.API_PORT || 4000),
  mongoUri: process.env.MONGODB_URI || "",
  adminUsername: process.env.ADMIN_USERNAME || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || "",
  adminJwtSecret: process.env.ADMIN_JWT_SECRET || "",
  clientOrigin: process.env.CLIENT_ORIGIN ? trimTrailingSlash(process.env.CLIENT_ORIGIN) : "",
};

export const validateServerConfig = () => {
  const missing = [];

  if (!config.mongoUri) missing.push("MONGODB_URI");
  if (!config.adminUsername) missing.push("ADMIN_USERNAME");
  if (!config.adminJwtSecret) missing.push("ADMIN_JWT_SECRET");
  if (!config.adminPassword && !config.adminPasswordHash) {
    missing.push("ADMIN_PASSWORD or ADMIN_PASSWORD_HASH");
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};
