import { OrderService } from './order.service';
import { UserService } from './user.service';
import { ProductService } from './product.service';
import { Order } from '../../models/order/order.interface';

export class OrderDetailService {
  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private productService: ProductService
  ) {}

  async getOrderDetails(orderId: string) {
    const order = await this.orderService.getOrderById(orderId);
    if (!order) {
      return null;
    }

    return this.enrichOrderWithDetails(order);
  }

  async getMultipleOrdersDetails(orders: Order[], isAdmin: boolean) {
    return Promise.all(orders.map(order => this.enrichOrderWithDetails(order, isAdmin)));
  }

  private async enrichOrderWithDetails(order: Order, isAdmin: boolean = false) {
    const user = await this.userService.getUserById(order.userId);
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
      userName: isAdmin && user ? `${user.username} (${user.id})` : (user ? user.username : 'Usuario desconocido'),
      date: order.date || new Date().toISOString()
    };
  }
}
