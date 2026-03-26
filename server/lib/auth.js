import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { AdminSettings } from "../models/AdminSettings.js";

const tokenExpiry = "7d";

const createBootstrapHash = async () => {
  if (config.adminPasswordHash) {
    return config.adminPasswordHash;
  }

  return bcrypt.hash(config.adminPassword, 10);
};

export const ensureAdminSettingsSeeded = async () => {
  const existingSettings = await AdminSettings.findOne();

  if (existingSettings) {
    return existingSettings;
  }

  const passwordHash = await createBootstrapHash();

  return AdminSettings.create({
    username: config.adminUsername,
    passwordHash,
  });
};

export const getAdminSettings = async () => {
  const settings = await AdminSettings.findOne();
  return settings ?? ensureAdminSettingsSeeded();
};

export const signAdminToken = (username) =>
  jwt.sign({ username, role: "admin" }, config.adminJwtSecret, {
    expiresIn: tokenExpiry,
  });

export const verifyAdminToken = (token) => jwt.verify(token, config.adminJwtSecret);

export const verifyAdminCredentials = async ({ username, password }) => {
  const settings = await getAdminSettings();

  if (username !== settings.username) {
    return { valid: false, username: settings.username };
  }

  const valid = await bcrypt.compare(password, settings.passwordHash);

  return {
    valid,
    username: settings.username,
  };
};

export const updateAdminPassword = async ({ currentPassword, newPassword }) => {
  const settings = await getAdminSettings();
  const currentMatches = await bcrypt.compare(currentPassword, settings.passwordHash);

  if (!currentMatches) {
    throw new Error("Current password is incorrect.");
  }

  settings.passwordHash = await bcrypt.hash(newPassword, 10);
  await settings.save();

  return settings;
};
