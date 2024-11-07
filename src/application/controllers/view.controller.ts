import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { OrderService } from "../services/order.service";
import { UserService } from "../services/user.service";
import { User } from "../../interfaces/user.interface";
import { OrderDetailService } from "../services/order-detail.service";
import { CategoryService } from "../services/category.service";

export class ViewController {
  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private userService: UserService,
    private orderDetailService: OrderDetailService,
    private categoryService: CategoryService
  ) {}

  renderLogin = (req: Request, res: Response) => {
    res.render("auth/login", { title: "Iniciar Sesión" });
  };

  renderRegister = (req: Request, res: Response) => {
    res.render("auth/register", { title: "Registro" });
  };

  renderResetPassword = (req: Request, res: Response) => {
    res.render("auth/reset-password", { title: "Restablecer Contraseña" });
  };

  renderWelcome(req: Request, res: Response) {
    res.render("welcome", { title: "Bienvenido", user: res.locals.user });
  }

  renderProductList = async (req: Request, res: Response) => {
    try {
      const categoryQuery = req.query.category as string[] | string | undefined;
      let selectedCategories: string[] = [];

      if (Array.isArray(categoryQuery)) {
        selectedCategories = categoryQuery.includes("all") ? [] : categoryQuery;
      } else if (typeof categoryQuery === "string") {
        selectedCategories = categoryQuery === "all" ? [] : [categoryQuery];
      }

      const allCategories = await this.productService.getCategories();
      const sortBy = req.query.sortBy as string | undefined;
      const keyword = req.query.keyword as string | undefined;

      const products = await this.productService.getFilteredProducts({
        category:
          selectedCategories.length > 0 ? selectedCategories : allCategories,
        sortBy,
        keyword,
      });

      res.render("products/list", {
        products,
        categories: allCategories,
        title: "Productos",
        currentCategory: selectedCategories,
        currentSort: sortBy,
        currentKeyword: keyword,
        user: res.locals.user,
      });
    } catch (error) {
      console.error("Error rendering product list:", error);
      res
        .status(500)
        .render("error", { message: "Error al cargar la lista de productos" });
    }
  };

  async renderProductDetails(req: Request, res: Response) {
    try {
      const product = await this.productService.getProductById(req.params.id);
      if (product) {
        res.render("products/details", {
          title: "Detalles del Producto",
          product,
          user: res.locals.user,
        });
      } else {
        res.status(404).render("error", { message: "Producto no encontrado" });
      }
    } catch (error) {
      console.error("Error fetching product details for view:", error);
      res.status(500).render("error", {
        message: "Error al obtener los detalles del producto",
      });
    }
  }

  async renderProductForm(req: Request, res: Response) {
    try {
      const categories = await this.categoryService.getAllCategories();
      const product = req.params.id
        ? await this.productService.getProductById(req.params.id)
        : null;
      
      res.render("products/form", {
        title: product ? "Editar Producto" : "Nuevo Producto",
        product,
        categories: categories.filter(cat => cat.active) 
      });
    } catch (error) {
      res.status(500).send("Error al cargar el formulario");
    }
  }
  
  renderOrderList = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user as User;
      if (!user) {
        res.status(401).render("error", { message: "Usuario no autenticado" });
        return;
      }

      let orders;
      if (user.isAdmin) {
        orders = await this.orderService.getAllOrders();
      } else {
        orders = await this.orderService.getOrdersByUserId(user.id);
      }

      const ordersWithDetails =
        await this.orderDetailService.getMultipleOrdersDetails(
          orders,
          user.isAdmin
        );

      res.render("orders/list", {
        orders: ordersWithDetails,
        title: "Lista de Órdenes",
        user: user,
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      console.error("Error al renderizar la lista de órdenes:", error);
      res
        .status(500)
        .render("error", { message: "Error interno del servidor" });
    }
  };

  async renderEditOrder(req: Request, res: Response) {
    try {
      const orderId = req.params.id;
      const orderDetails = await this.orderDetailService.getOrderDetails(
        orderId
      );
      if (!orderDetails) {
        return res
          .status(404)
          .render("error", { message: "Orden no encontrada" });
      }
      res.render("orders/edit", {
        order: orderDetails,
        title: "Editar Orden",
      });
    } catch (error) {
      this.handleError(res, error as Error);
    }
  }

  async renderUserList(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.render("users/list", {
        title: "Listado de Usuarios",
        users,
        user: res.locals.user,
      });
    } catch (error) {
      console.error("Error fetching users for view:", error);
      res
        .status(500)
        .render("error", { message: "Error al obtener los usuarios" });
    }
  }

  async renderEditUser(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (user) {
        res.render("users/edit", {
          title: "Editar Usuario",
          user,
          currentUser: res.locals.user,
        });
      } else {
        res.status(404).render("error", { message: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("Error fetching user for edit:", error);
      res.status(500).render("error", {
        message: "Error al obtener el usuario para editar",
      });
    }
  }

  async renderCategoryList(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.render("products/categories/list", { categories });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener categorías" });
    }
  }

  handleError(res: Response, error: Error) {
    console.error(error);
    res.status(500).render("error", {
      message: error.message || "Ha ocurrido un error",
      error: process.env.NODE_ENV === "development" ? error : {},
    });
  }
}
