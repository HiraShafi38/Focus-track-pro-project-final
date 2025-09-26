import { Router } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { authGuard, AuthedRequest } from "../middleware/auth";
import { Task } from "../models/Task";

const router = Router();
router.use(authGuard);

// ---- validators
const createSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  dueDate: z.string().datetime().optional()  // ISO string "2025-09-24T12:00:00Z"
});

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  // to clear dueDate send null; to set it send ISO string
  dueDate: z.union([z.string().datetime(), z.null()]).optional()
});

const listQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  search: z.string().optional()
});

// ---- create
router.post("/", async (req: AuthedRequest, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const task = await Task.create({
      owner: req.user!.id,
      title: data.title,
      description: data.description || "",
      status: data.status ?? "todo",
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined
    });
    res.status(201).json({ task });
  } catch (err) { next(err); }
});

// ---- list (with filters & pagination)
router.get("/", async (req: AuthedRequest, res, next) => {
  try {
    const q = listQuery.parse(req.query);
    const filter: any = { owner: req.user!.id };
    if (q.status) filter.status = q.status;
    if (q.search) filter.title = { $regex: q.search, $options: "i" };

    const skip = (q.page - 1) * q.limit;
    const [items, total] = await Promise.all([
      Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(q.limit),
      Task.countDocuments(filter)
    ]);
    res.json({ items, page: q.page, total, pages: Math.ceil(total / q.limit) });
  } catch (err) { next(err); }
});

// ---- get one
router.get("/:id", async (req: AuthedRequest, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "invalid id" });
    const task = await Task.findOne({ _id: id, owner: req.user!.id });
    if (!task) return res.status(404).json({ message: "not found" });
    res.json({ task });
  } catch (err) { next(err); }
});

// ---- update (partial)
router.patch("/:id", async (req: AuthedRequest, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "invalid id" });
    const data = updateSchema.parse(req.body);

    const task = await Task.findOne({ _id: id, owner: req.user!.id });
    if (!task) return res.status(404).json({ message: "not found" });

    if (data.title !== undefined) task.title = data.title;
    if (data.description !== undefined) task.description = data.description;
    if (data.status !== undefined) task.status = data.status;
    if ("dueDate" in data) {
      if (data.dueDate === null) task.set({ dueDate: undefined }); // clear
      else task.dueDate = new Date(data.dueDate as string);
    }
    await task.save();
    res.json({ task });
  } catch (err) { next(err); }
});

// ---- delete
router.delete("/:id", async (req: AuthedRequest, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "invalid id" });
    const result = await Task.deleteOne({ _id: id, owner: req.user!.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: "not found" });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
