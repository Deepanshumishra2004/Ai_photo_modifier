import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import z from "zod";
import type { UserDetail } from "../type.js";

const userRoutes = Router();

// In a real project: replace with DB (Mongo, Postgres, Prisma, etc.)
const users : UserDetail[] = [];  

const SigninSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// SIGNUP
userRoutes.post("/signin", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    // Check if user already exists
    const userExists = users.find((u) => u.email === email);
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    const newUser = { id: users.length + 1, username, email, password: hashed };
    users.push(newUser);

    return res.status(201).json({ message: "User created", userId: newUser.id });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});


// LOGIN
userRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    // Find user
    const user = users.find((u) => u.email === email);
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      "SECRET_KEY",               // ❗ In production → store in .env
      { expiresIn: "7d" }
    );

    return res.json({ message: "Login successful", token });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});


export default userRoutes;
