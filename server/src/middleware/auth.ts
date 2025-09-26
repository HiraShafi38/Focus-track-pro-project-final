import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";


export interface AuthedRequest extends Request {
  user?: { id: string };
}

export function authGuard(req: AuthedRequest, res: Response, next: NextFunction) {
  const hdr = req.header("Authorization") || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Missing Bearer token" });

  try {
    const decoded = verifyToken<{ id: string }>(token);
    req.user = { id: decoded.id };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
