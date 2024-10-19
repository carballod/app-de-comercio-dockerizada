import { OrderJsonRepository } from "../../infrastructure/persistence/order.json.repository";
import { Order } from "../../models/order/order.interface";

export class OrderService {
  constructor(private orderRepository: OrderJsonRepository) {}

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }

  async createOrder(orderData: Omit<Order, "id">): Promise<Order> {
    if (!orderData.userId || !orderData.products || !orderData.totalAmount) {
      throw new Error('Datos de orden incompletos');
    }
    const id = Date.now().toString();

  const newOrder: Order = {
    id,
    ...orderData,
    status: orderData.status || 'pending' 
  };

  return this.orderRepository.save(newOrder);
}

  async updateOrder(
    id: string,
    orderData: Partial<Omit<Order, "id">>
  ): Promise<Order | null> {
    return this.orderRepository.update(id, orderData);
  }

  async deleteOrder(id: string): Promise<boolean> {
    return this.orderRepository.deleteById(id);
  }
}
