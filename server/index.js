import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { config, validateServerConfig } from "./config.js";
import {
  ensureAdminSettingsSeeded,
  signAdminToken,
  updateAdminPassword,
  verifyAdminCredentials,
} from "./lib/auth.js";
import { toPropertyDocument, serializeProperty } from "./lib/properties.js";
import { buildSitemapXml, resolveSiteUrl } from "./lib/sitemap.js";
import { requireAdmin } from "./middleware/require-admin.js";
import { Property } from "./models/Property.js";
import { defaultProperties } from "./data/defaultProperties.js";

validateServerConfig();

const app = express();
app.set("trust proxy", true);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distPath = path.join(projectRoot, "dist");
const uploadsPath = path.join(projectRoot, "public", "uploads");

fs.mkdirSync(uploadsPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsPath);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    const safeBaseName = path
      .basename(file.originalname || "image", extension)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    callback(null, `${safeBaseName || "image"}-${uniqueSuffix}${extension || ".jpg"}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 10,
  },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
      return;
    }

    callback(new Error("Only image uploads are allowed."));
  },
});

const corsOptions = config.clientOrigin
  ? {
      origin: config.clientOrigin,
      credentials: false,
    }
  : undefined;

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(uploadsPath));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/sitemap.xml", async (req, res, next) => {
  try {
    const properties = await Property.find({}, { _id: 1, createdAt: 1, updatedAt: 1 }).lean();
    const siteUrl = resolveSiteUrl({
      configuredSiteUrl: config.siteUrl,
      req,
    });

    res.type("application/xml");
    res.send(
      buildSitemapXml({
        siteUrl,
        properties,
      }),
    );
  } catch (error) {
    next(error);
  }
});

app.get("/robots.txt", (req, res) => {
  const siteUrl = resolveSiteUrl({
    configuredSiteUrl: config.siteUrl,
    req,
  });

  res.type("text/plain");
  res.send(`User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`);
});

app.post("/api/admin/login", async (req, res) => {
  const { username = "", password = "" } = req.body ?? {};

  const auth = await verifyAdminCredentials({ username, password });

  if (!auth.valid) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = signAdminToken(auth.username);

  return res.json({
    token,
    username: auth.username,
  });
});

app.get("/api/admin/session", requireAdmin, (req, res) => {
  res.json({
    authenticated: true,
    username: req.admin.username,
  });
});

app.patch("/api/admin/password", requireAdmin, async (req, res, next) => {
  const { currentPassword = "", newPassword = "" } = req.body ?? {};

  if (typeof newPassword !== "string" || newPassword.trim().length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters long." });
  }

  try {
    const settings = await updateAdminPassword({
      currentPassword,
      newPassword: newPassword.trim(),
    });

    return res.json({
      success: true,
      username: settings.username,
    });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/uploads", requireAdmin, upload.array("images", 10), (req, res) => {
  const files = Array.isArray(req.files) ? req.files : [];

  res.status(201).json({
    urls: files.map((file) => `/uploads/${file.filename}`),
  });
});

app.get("/api/properties", async (_req, res, next) => {
  try {
    const properties = await Property.find().sort({ featured: -1, createdAt: -1 }).lean(false);
    res.json(properties.map(serializeProperty));
  } catch (error) {
    next(error);
  }
});

app.get("/api/properties/:id", async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    return res.json(serializeProperty(property));
  } catch (error) {
    next(error);
  }
});

app.post("/api/properties", requireAdmin, async (req, res, next) => {
  try {
    const property = await Property.create(toPropertyDocument(req.body));
    res.status(201).json(serializeProperty(property));
  } catch (error) {
    next(error);
  }
});

app.put("/api/properties/:id", requireAdmin, async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, toPropertyDocument(req.body), {
      new: true,
      runValidators: true,
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    return res.json(serializeProperty(property));
  } catch (error) {
    next(error);
  }
});

app.delete("/api/properties/:id", requireAdmin, async (req, res, next) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  const status = error?.name === "ValidationError" ? 400 : 500;
  const message = error instanceof Error ? error.message : "Unexpected server error.";

  res.status(status).json({ message });
});

const start = async () => {
  await mongoose.connect(config.mongoUri);
  await ensureAdminSettingsSeeded();

  const count = await Property.countDocuments();
  if (count === 0) {
    await Property.insertMany(defaultProperties);
  }

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(config.port, () => {
    console.log(`API server listening on http://localhost:${config.port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
