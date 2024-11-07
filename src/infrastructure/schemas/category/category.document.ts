import { Document } from "mongoose";

export interface ICategoryDocument extends Document {
  name: string;
  description: string;
  active: boolean;
}