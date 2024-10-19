import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { User } from "../../models/user/user.interface";
import { Order } from "../../models/order/order.interface";

export class OrderController {
  constructor(private orderService: OrderService) {}

  private handleError(res: Response, error: unknown, message: string) {
    console.error(`Error in ${message}:`, error);
    res.status(500).json({
      message: `Error ${message.toLowerCase()}`,
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }

  async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await this.orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      this.handleError(res, error, "fetching orders");
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      this.handleError(res, error, "fetching order");
    }
  }

  async getOrdersByUserId(req: Request, res: Response) {
    try {
      const orders = await this.orderService.getOrdersByUserId(
        req.params.userId
      );
      res.json(orders);
    } catch (error) {
      this.handleError(res, error, "fetching user orders");
    }
  }

  async createOrder(req: Request, res: Response) {
    try {
      const userId = (res.locals.user as User).id;
      const { items } = req.body;

      const orderData: Omit<Order, 'id'> = {
        userId,
        products: items.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity
        })),
        totalAmount: items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0),
        status: 'pending'
      };

      const newOrder = await this.orderService.createOrder(orderData);
      res.status(201).json({ message: 'Orden creada exitosamente', order: newOrder });
    } catch (error) {
      this.handleError(res, error, "creating order");
    }
  }

  async updateOrder(req: Request, res: Response) {
    try {
      const updatedOrder = await this.orderService.updateOrder(
        req.params.id,
        req.body
      );
      if (updatedOrder) {
        res.json(updatedOrder);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      this.handleError(res, error, "updating order");
    }
  }

  async deleteOrder(req: Request, res: Response) {
    try {
      const isDeleted = await this.orderService.deleteOrder(req.params.id);
      if (isDeleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      this.handleError(res, error, "deleting order");
    }
  }
}
