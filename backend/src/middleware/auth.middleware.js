// ✅ import statements
import jwt from "jsonwebtoken";
import db from "../libs/db.js";

// ✅ Auth Middleware
// Security guard: checks JWT and attaches user to req object
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    // 🔁 [Improvement] Use 403 instead of 401 for no token
    if (!token) {
      return res.status(403).json({
        message: "Unauthorized - No token provided",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized - Invalid token", // 🔁 [Typo fix] from "invailed" to "Invalid"
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        image: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user; // ✅ [New comment] Attach user to req
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ message: "Internal Server Error during authentication" }); // 🔁 [Improved message]
  }
};

// ✅ Admin Role Checker Middleware
export const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access Denied - Admins Only",
      });
    }

    next(); // ✅ All good, go to next middleware/route
  } catch (error) {
    console.error("Error checking admin role:", error);
    res.status(500).json({ message: "Internal Server Error while checking admin role" }); // 🔁 [Improved message]
  }
};
