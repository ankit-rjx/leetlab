import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        messsage: "Unauthorize - No token provided",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        messsage: "Unauthorize - Invialed Token ",
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
        messsage: "user not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error authentication user:", error);
    res.status(500).json({
      messsage: "Error authenticating user",
    });
  }
};
