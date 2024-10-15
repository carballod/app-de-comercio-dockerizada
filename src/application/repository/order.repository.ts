import { Order } from "../../models/order/order.interface";

export interface IOrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  save(order: Omit<Order, "id">): Promise<Order>;
  update(id: string, order: Partial<Omit<Order, "id">>): Promise<Order | null>;
  deleteById(id: string): Promise<boolean>;
}
