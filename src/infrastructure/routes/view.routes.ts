import express from "express";
import { ViewController } from "../../application/controllers/view.controller";
import { ProductService } from "../../application/services/product.service";
import { CategoryService } from "../../application/services/category.service";
import { OrderService } from "../../application/services/order.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { UserService } from "../../application/services/user.service";
import { OrderDetailService } from "../../application/services/order-detail.service";
import { UserMongoRepository } from "../persistence/user.mongo.repository";
import { ProductMongoRepository } from "../persistence/product.mongo.repository";
import { OrderMongoRepository } from "../persistence/order.mongo.repository";
import { CategoryMongoRepository } from "../persistence/category.mongo.repository";
const viewRoutes = express.Router();
const userRepository = new UserMongoRepository();
const productRepository = new ProductMongoRepository();
const orderRepository = new OrderMongoRepository();
const categoryRepository = new CategoryMongoRepository();

const productService = new ProductService(productRepository);
const orderService = new OrderService(orderRepository);
const userService = new UserService(userRepository);
const orderDetailService = new OrderDetailService(
  orderService,
  userService,
  productService
);
const categoryService = new CategoryService(categoryRepository);
const viewController = new ViewController(
  productService,
  orderService,
  userService,
  orderDetailService,
  categoryService

);
viewRoutes.use(authMiddleware);

viewRoutes.get("/", (req, res) => {
  console.log(res.locals.user);
  if (res.locals.user) {
    viewController.renderWelcome(req, res);
  } else {
    res.redirect("/login");
  }
});

viewRoutes.get("/login", (req, res) => {
  if (res.locals.user) {
    res.redirect("/");
  } else {
    viewController.renderLogin(req, res);
  }
});

viewRoutes.get("/register", viewController.renderRegister.bind(viewController));
viewRoutes.get(
  "/reset-password",
  viewController.renderResetPassword.bind(viewController)
);

viewRoutes.get(
  "/products",
  viewController.renderProductList.bind(viewController)
);
viewRoutes.get(
  "/products/categories",
  adminMiddleware,
  (req, res) => viewController.renderManagementView(req, res, 'categories')
)
viewRoutes.get(
  "/products/new",
  adminMiddleware,
  viewController.renderProductForm.bind(viewController)
);
viewRoutes.get(
  "/products/:id/edit",
  adminMiddleware,
  viewController.renderProductForm.bind(viewController)
);
viewRoutes.get(
  "/products/:id",
  viewController.renderProductDetails.bind(viewController)
);
viewRoutes.get("/orders", viewController.renderOrderList);

viewRoutes.get(
  "/users",
  adminMiddleware,
  (req, res) => viewController.renderManagementView(req, res, 'users')
);

export default viewRoutes;
