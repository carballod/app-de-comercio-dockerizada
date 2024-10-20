import express from "express";
import { OrderController } from "../../application/controllers/order.controller";
import { OrderService } from "../../application/services/order.service";
import { OrderJsonRepository } from "../../../data/persistence/order.json.repository";
import { ProductJsonRepository } from "../../../data/persistence/product.json.repository";
import { ProductService } from "../../application/services/product.service";
import { UserJsonRepository } from "../../../data/persistence/user.json.repository";
import { UserService } from "../../application/services/user.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { OrderDetailService } from "../../application/services/order-detail.service";

const orderRoutes = express.Router();
const orderRepository = new OrderJsonRepository();
const orderService = new OrderService(orderRepository);
const productRepository = new ProductJsonRepository();
const productService = new ProductService(productRepository);
const userRepository = new UserJsonRepository();
const userService = new UserService(userRepository);
const orderDetailService = new OrderDetailService(orderService, userService, productService);
const orderController = new OrderController(orderService, orderDetailService);

orderRoutes.use(authMiddleware);
orderRoutes.get("/", orderController.getAllOrders.bind(orderController));
orderRoutes.get("/:id", orderController.getOrderById.bind(orderController));
orderRoutes.get("/user/:userId", orderController.getOrdersByUserId.bind(orderController));
orderRoutes.post("/", orderController.createOrder.bind(orderController));
orderRoutes.delete("/:id", orderController.deleteOrder.bind(orderController));
orderRoutes.post("/:id/cancel", orderController.cancelOrder.bind(orderController));
orderRoutes.put("/:id", orderController.updateOrder.bind(orderController));

export default orderRoutes;
