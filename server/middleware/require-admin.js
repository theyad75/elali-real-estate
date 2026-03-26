import { verifyAdminToken } from "../lib/auth.js";

export const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const payload = verifyAdminToken(token);
    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
