import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User Already Exist",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        password: hashPassword,
        name,
        role: UserRole.USER,
      },
    });
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Days
    });

    res.status(201).json({
      message: "User created SuccessFully",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.error("Error Creating user :", error);
    res.status(501).json({
      error: "Error creating User ",
    });
  }
};

export const login = async (req, res) => {};
export const logout = async (req, res) => {};
export const check = async (req, res) => {};
