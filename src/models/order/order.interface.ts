export interface Order {
  id: string;
  userId: string;
  products: { productId: string; quantity: number , price:number}[];
  totalAmount: number;
  status: "pending" | "in progress" | "completed" | "cancelled";
  date: Date;
}
