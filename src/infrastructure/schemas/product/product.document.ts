import { Document } from "mongoose";

export interface IProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
}
