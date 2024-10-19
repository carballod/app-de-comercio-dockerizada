import express from "express";
import { OrderController } from "../../application/controllers/order.controller";
import { OrderService } from "../../application/services/order.service";
import { OrderJsonRepository } from "../persistence/order.json.repository";
import { ProductJsonRepository } from "../persistence/product.json.repository";
import { ProductService } from "../../application/services/product.service";

const orderRoutes = express.Router();
const orderRepository = new OrderJsonRepository();
const orderService = new OrderService(orderRepository);
const productRepository = new ProductJsonRepository();
const productService = new ProductService(productRepository);
const orderController = new OrderController(orderService, productService);

orderRoutes.get("/", orderController.getAllOrders.bind(orderController));
orderRoutes.get("/:id", orderController.getOrderById.bind(orderController));
orderRoutes.get("/user/:userId", orderController.getOrdersByUserId.bind(orderController));
orderRoutes.post("/", orderController.createOrder.bind(orderController));
orderRoutes.put("/:id", orderController.updateOrder.bind(orderController));
orderRoutes.delete("/:id", orderController.deleteOrder.bind(orderController));
orderRoutes.post("/:id/cancel", orderController.cancelOrder.bind(orderController));


export default orderRoutes;