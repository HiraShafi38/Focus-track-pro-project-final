import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db";
import { notFound, errorHandler } from "./middleware/error";
import health from "./routes/health.route";
import authRoutes from "./routes/auth.route";
import taskRoutes from "./routes/tasks.route";

const app = express();

// --- config
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const MONGODB_URI = process.env.MONGODB_URI || "";

// --- middleware
app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, credentials: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

// --- routes
app.use("/api/health", health);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// --- 404 & error
app.use(notFound);
app.use(errorHandler);

// --- start
async function start() {
  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI");
    process.exit(1);
  }
  await connectDB(MONGODB_URI);
  app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
}
start();

