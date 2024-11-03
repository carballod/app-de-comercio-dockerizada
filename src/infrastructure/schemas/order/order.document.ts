import { Document, Types } from "mongoose";

export interface IOrderDocument extends Document {
  userId: Types.ObjectId;
  products: Array<{
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: "pending" | "in progress" | "completed" | "cancelled";
  date: Date;
}
