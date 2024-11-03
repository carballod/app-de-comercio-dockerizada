import mongoose, { Schema } from "mongoose";
import { IUserDocument } from "./user.document";

const UserSchema = new Schema<IUserDocument>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });

export const User = mongoose.model<IUserDocument>("User", UserSchema);
