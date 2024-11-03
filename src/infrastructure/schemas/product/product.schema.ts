import mongoose, { Schema } from "mongoose";
import { IProductDocument } from "./product.document";

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ name: 1 });

export const Product = mongoose.model<IProductDocument>(
  "Product",
  ProductSchema
);
