import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type TaskStatus = "todo" | "in-progress" | "done";

export interface ITask extends Document {
  owner: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo", index: true },
    dueDate: { type: Date }
  },
  { timestamps: true }
);

TaskSchema.index({ owner: 1, createdAt: -1 });

export const Task: Model<ITask> = mongoose.model<ITask>("Task", TaskSchema);
