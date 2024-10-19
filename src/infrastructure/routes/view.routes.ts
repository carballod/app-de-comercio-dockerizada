import express from "express";
import { ViewController } from "../../application/controllers/view.controller";
import { ProductService } from "../../application/services/product.service";
import { OrderService } from "../../application/services/order.service";
import { ProductJsonRepository } from "../persistence/product.json.repository";
import { OrderJsonRepository } from "../persistence/order.json.repository";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { UserService } from "../../application/services/user.service";
import { UserJsonRepository } from "../persistence/user.json.repository";

const viewRoutes = express.Router();
const userRepository = new UserJsonRepository();
const productRepository = new ProductJsonRepository();
const orderRepository = new OrderJsonRepository();
const productService = new ProductService(productRepository);
const orderService = new OrderService(orderRepository);
const userService = new UserService(userRepository);
const viewController = new ViewController(productService, orderService, userService);

viewRoutes.get("/", (req, res) => {
    console.log(res.locals.user);
  if (res.locals.user) {
    viewController.renderWelcome(req, res);
  } else {
    res.redirect('/login');
  }
});

viewRoutes.get("/login", (req, res) => {
  if (res.locals.user) {
    res.redirect('/');
  } else {
    viewController.renderLogin(req, res);
  }
});
viewRoutes.get("/register", viewController.renderRegister.bind(viewController));
viewRoutes.get("/reset-password", viewController.renderResetPassword.bind(viewController));

viewRoutes.get("/products", authMiddleware, viewController.renderProductList.bind(viewController));
viewRoutes.get("/products/new", authMiddleware, adminMiddleware, viewController.renderProductForm.bind(viewController));
viewRoutes.get("/products/:id/edit", authMiddleware, adminMiddleware, viewController.renderEditProductForm.bind(viewController));
viewRoutes.get("/products/:id", authMiddleware, viewController.renderProductDetails.bind(viewController));
viewRoutes.get("/orders", authMiddleware, viewController.renderOrderList);
viewRoutes.get("/orders/:id/edit", authMiddleware, viewController.renderEditOrder);

viewRoutes.get("/users", authMiddleware, adminMiddleware, viewController.renderUserList.bind(viewController));
viewRoutes.get("/users/:id/edit", authMiddleware, adminMiddleware, viewController.renderEditUser.bind(viewController));

export default viewRoutes;
