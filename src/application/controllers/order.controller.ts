import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order.service";
import { ProductService } from "../services/product.service";
import { User } from "../../models/user/user.interface";
import { Order } from "../../models/order/order.interface";
import { UserService } from "../services/user.service";
export class OrderController {
  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private userService: UserService
  ) {}

  private handleError(res: Response, error: unknown, message: string) {
    console.error(`Error in ${message}:`, error);
    res.status(500).json({
      message: `Error ${message.toLowerCase()}`,
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = res.locals.user as User;
      if (!user) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      let orders: Order[];

      if (user.isAdmin) {
        orders = await this.orderService.getAllOrders();
      } else {
        orders = await this.orderService.getOrdersByUserId(user.id);
      }

      const ordersWithDetails = await Promise.all(orders.map(async (order) => {
        const productsWithDetails = await Promise.all(order.products.map(async (product) => {
          const productDetails = await this.productService.getProductById(product.productId);
          return {
            ...product,
            name: productDetails ? productDetails.name : 'Producto no encontrado',
            description: productDetails ? productDetails.description : 'Descripción no disponible',
            price: typeof product.price === 'number' ? product.price : undefined
          };
        }));

        return {
          ...order,
          products: productsWithDetails,
          userName: user.isAdmin ? await this.userService.getUserById(order.userId) : undefined
        };
      }));

      if (req.accepts('html')) {
        res.render('orders/list', { 
          orders: ordersWithDetails, 
          isAdmin: user.isAdmin 
        });
      } else {
        res.json(ordersWithDetails);
      }
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
      const userId = (res.locals.user as User).id;
      const orders = await this.orderService.getOrdersByUserId(userId);
      
      const ordersWithDetails = await Promise.all(orders.map(async (order) => {
        const productsWithDetails = await Promise.all(order.products.map(async (product) => {
          const productDetails = await this.productService.getProductById(product.productId);
          return {
            ...product,
            name: productDetails ? productDetails.name : 'Producto no encontrado',
            price: productDetails ? productDetails.price : 0
          };
        }));

        return {
          ...order,
          products: productsWithDetails,
          date: order.date || new Date().toISOString() 
        };
      }));

      res.render('orders/list', { orders: ordersWithDetails });
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).render('error', { message: "Error al obtener las órdenes del usuario" });
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
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0),
        status: 'pending',
        date: new Date()
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

  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id;
      const userId = (res.locals.user as User).id;
      const order = await this.orderService.getOrderById(orderId);

      if (!order || order.userId !== userId) {
        res.status(404).json({ message: "Orden no encontrada" });
        return;
      }

      if (order.status !== 'pending') {
        res.status(400).json({ message: "Solo se pueden cancelar órdenes pendientes" });
        return;
      }

      const updatedOrder = await this.orderService.updateOrder(orderId, { status: 'cancelled' });
      res.json({ message: "Orden cancelada exitosamente", order: updatedOrder });
    } catch (error) {
      next(error);
    }
  }
}
