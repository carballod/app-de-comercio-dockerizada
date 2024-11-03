import mongoose, { Schema, Document, Types } from "mongoose";

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

export interface IProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface IUserDocument extends Document {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

// Schemas
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

// Indexes
ProductSchema.index({ name: 1 });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
OrderSchema.index({ userId: 1 });

// Models
export const Product = mongoose.model<IProductDocument>(
  "Product",
  ProductSchema
);
export const User = mongoose.model<IUserDocument>("User", UserSchema);
export const Order = mongoose.model<IOrderDocument>("Order", OrderSchema);
