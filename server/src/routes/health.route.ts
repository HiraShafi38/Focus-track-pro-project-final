import { Router } from "express";
const router = Router();

router.get("/", (_req, res) => {
  res.json({ ok: true, service: "task-master-api" });
});

export default router;
