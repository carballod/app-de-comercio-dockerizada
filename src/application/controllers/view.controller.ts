import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { OrderService } from "../services/order.service";
import { UserService } from "../services/user.service";
import { User } from "../../interfaces/user.interface";
import { OrderDetailService } from "../services/order-detail.service";
import { CategoryService } from "../services/category.service";
import { title } from "process";

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



  async renderManagementView(req: Request, res: Response, type: 'users' | 'categories'): Promise<void>  {
    try {
      let viewData;
      
      if (type === 'users') {
        const users = await this.userService.getAllUsers();
        viewData = {
          entityName: 'Usuarios',
          title: 'Gestión de Usuarios',
          entityNameSingular: 'Usuario',
          apiEndpoint: 'user',
          headers: ['ID', 'Usuario', 'Email', 'Rol'],
          fields: ['id', 'username', 'email', 'isAdmin'],
          items: users,
          booleanFields: {
            isAdmin: {
              trueLabel: '<span class="badge bg-success">Administrador</span>',
              falseLabel: '<span class="badge bg-warning">Usuario</span>'
            }
          },
          formFields: [
            { name: 'username', label: 'Usuario', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'isAdmin', label: 'Es Admin', type: 'select', required: true, 
              options: [
                { value: 'true', label: 'Sí' },
                { value: 'false', label: 'No' }
              ]
            }],
            createOnlyFields: [
              { name: 'password', label: 'Password', type: 'password', required: true }
          ]
        };
      } else {
        const categories = await this.categoryService.getAllCategories();
        viewData = {
          entityName: 'Categorías',
          title: 'Gestión de Categorías',
          entityNameSingular: 'Categoría',
          apiEndpoint: 'category',
          headers: ['Nombre', 'Descripción', 'Estado'],
          fields: ['name', 'description', 'active'],
          items: categories,
          booleanFields: {
            active: {
              trueLabel: '<span class="badge bg-success">Activo</span>',
              falseLabel: '<span class="badge bg-danger">Inactivo</span>'
            }
          },
          formFields: [
            { name: 'name', label: 'Nombre', type: 'text', required: true },
            { name: 'description', label: 'Descripción', type: 'text', required: true },
            { name: 'active', label: 'Activo', type: 'checkbox' }
          ]
        };
      }
      
      res.render('admin/management', viewData);
    } catch (error) {
      this.handleError(res, error as Error);
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
