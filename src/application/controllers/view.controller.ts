import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { OrderService } from "../services/order.service";
import { UserService } from "../services/user.service";
import { User } from "../../models/user/user.interface";

export class ViewController {
  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private userService: UserService
  ) {}

  renderLogin = (req: Request, res: Response) => {
    res.render('auth/login', { title: 'Iniciar Sesión' });
  }

  renderRegister = (req: Request, res: Response) => {
    res.render('auth/register', { title: 'Registro' });
  }

  renderResetPassword = (req: Request, res: Response) => {
    res.render('auth/reset-password', { title: 'Restablecer Contraseña' });
  }

  renderWelcome(req: Request, res: Response) {
    res.render('welcome', { title: 'Bienvenido', user: res.locals.user });
  }

  renderProductList = async (req: Request, res: Response) => {
    try {
      const products = await this.productService.getAllProducts();
      res.render('products/list', { title: 'Listado de Productos', products, user: res.locals.user });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).render('error', { message: "Error al obtener los productos" });
    }
  }

  async renderProductDetails(req: Request, res: Response) {
    try {
      const product = await this.productService.getProductById(req.params.id);
      if (product) {
        res.render('products/details', { title: 'Detalles del Producto', product, user: res.locals.user });
      } else {
        res.status(404).render('error', { message: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error("Error fetching product details for view:", error);
      res.status(500).render('error', { message: 'Error al obtener los detalles del producto' });
    }
  }

  renderProductForm(req: Request, res: Response, next: NextFunction) {
    try {
      res.render('products/form', { title: 'Agregar Producto', user: res.locals.user });
    } catch (error) {
      next(error);
    }
  }

  async renderEditProduct(req: Request, res: Response) {
    try {
      const product = await this.productService.getProductById(req.params.id);
      if (product) {
        res.render('products/edit', { title: 'Editar Producto', product, user: res.locals.user });
      } else {
        res.status(404).render('error', { message: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error("Error fetching product for edit:", error);
      res.status(500).render('error', { message: 'Error al obtener el producto para editar' });
    }
  }

  renderOrderList = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user as User;
      if (!user) {
        res.status(401).render('error', { message: 'Usuario no autenticado' });
        return;
      }

      let orders;
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

        let orderUser;
        if (user.isAdmin) {
          orderUser = await this.userService.getUserById(order.userId);
        }

        return {
          ...order,
          products: productsWithDetails,
          userName: orderUser ? `${orderUser.username} (${orderUser.id})` : 'Usuario desconocido'
        };
      }));

      res.render('orders/list', { 
        orders: ordersWithDetails, 
        title: 'Lista de Órdenes', 
        user: user, 
        isAdmin: user.isAdmin 
      });
    } catch (error) {
      console.error('Error al renderizar la lista de órdenes:', error);
      res.status(500).render('error', { message: 'Error interno del servidor' });
    }
  };

  async renderEditOrder(req: Request, res: Response) {
    try {
      const orderId = req.params.id;
      const order = await this.orderService.getOrderById(orderId);
      if (!order) {
        return res.status(404).render('error', { message: 'Orden no encontrada' });
      }
      const user = await this.userService.getUserById(order.userId);
      const products = await Promise.all(order.products.map(async (product) => {
        const productDetails = await this.productService.getProductById(product.productId);
        return { ...product, name: productDetails ? productDetails.name : 'Producto no encontrado' };
      }));
      res.render('orders/edit', { 
        order: { ...order, products }, 
        userName: user ? user.username : 'Usuario desconocido',
        title: 'Editar Orden'
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async renderUserList(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.render('users/list', { title: 'Listado de Usuarios', users, user: res.locals.user });
    } catch (error) {
      console.error("Error fetching users for view:", error);
      res.status(500).render('error', { message: 'Error al obtener los usuarios' });
    }
  }

  async renderEditUser(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (user) {
        res.render('users/edit', { title: 'Editar Usuario', user, currentUser: res.locals.user });
      } else {
        res.status(404).render('error', { message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error("Error fetching user for edit:", error);
      res.status(500).render('error', { message: 'Error al obtener el usuario para editar' });
    }
  }

  async renderEditProductForm(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id;
      const product = await this.productService.getProductById(productId);
      if (product) {
        res.render('products/form', { title: 'Editar Producto', product, user: res.locals.user });
      } else {
        res.status(404).render('error', { message: 'Producto no encontrado' });
      }
    } catch (error) {
      next(error);
    }
  }

  handleError(res: Response, error: any) {
    console.error(error);
    res.status(500).render('error', {
      message: error.message || 'Ha ocurrido un error',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
}
