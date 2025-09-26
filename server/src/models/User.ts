import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  createdAt: Date;
  comparePassword(plain: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "" }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

UserSchema.methods.comparePassword = async function (plain: string) {
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(plain, this.passwordHash);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
