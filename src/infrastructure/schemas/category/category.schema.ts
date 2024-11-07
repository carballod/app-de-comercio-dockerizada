import mongoose, { Schema } from "mongoose";
import { ICategoryDocument } from "./category.document";

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

CategorySchema.index({ name: 1 });

export const Category = mongoose.model<ICategoryDocument>("Category", CategorySchema);