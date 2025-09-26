import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // Zod validation errors -> 400 with neat list
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
  }

  // Duplicate key (e.g. email unique)
  if (err?.code === 11000) {
    return res
      .status(409)
      .json({ message: "Duplicate value", fields: Object.keys(err.keyPattern || {}) });
  }

  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
}
