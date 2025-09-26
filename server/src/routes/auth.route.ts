import { Router } from "express";
import { z } from "zod";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import { authGuard, AuthedRequest } from "../middleware/auth";

const router = Router();

// ---------- Schemas
const emailSchema = z.string().email().max(254);
const passwordSchema = z.string().min(6).max(128);
const nameSchema = z.string().max(60).optional();

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// ---------- Register
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "email already registered" });

    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ email: email.toLowerCase(), passwordHash, name: name || "" });

    const token = signToken({ id: user.id.toString() });
    return res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name, createdAt: user.createdAt }
    });
  } catch (err) {
    next(err);
  }
});

// ---------- Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "invalid credentials" });

    const token = signToken({ id: user.id.toString() });
    return res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name, createdAt: user.createdAt }
    });
  } catch (err) {
    next(err);
  }
});

// ---------- Current user
router.get("/me", authGuard, async (req: AuthedRequest, res, next) => {
  try {
    const me = await User.findById(req.user!.id).select("_id email name createdAt");
    if (!me) return res.status(404).json({ message: "user not found" });
    res.json({ user: me });
  } catch (err) {
    next(err);
  }
});

export default router;
