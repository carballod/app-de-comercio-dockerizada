import mongoose, { Schema } from "mongoose";
import { IOrderDocument } from "./order.document";

const OrderSchema = new Schema<IOrderDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "in progress", "completed", "cancelled"],
      default: "pending",
    },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ userId: 1 });

export const Order = mongoose.model<IOrderDocument>("Order", OrderSchema);
