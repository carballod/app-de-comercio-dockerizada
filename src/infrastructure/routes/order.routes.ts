import express from "express";
import { OrderController } from "../../application/controllers/order.controller";
import { OrderService } from "../../application/services/order.service";
import { OrderJsonRepository } from "../persistence/order.json.repository";

const orderRoutes = express.Router();
const orderRepository = new OrderJsonRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

orderRoutes.get("/", orderController.getAllOrders.bind(orderController));
orderRoutes.get("/:id", orderController.getOrderById.bind(orderController));
orderRoutes.get("/user/:userId", orderController.getOrdersByUserId.bind(orderController));
orderRoutes.post("/", orderController.createOrder.bind(orderController));
orderRoutes.put("/:id", orderController.updateOrder.bind(orderController));
orderRoutes.delete("/:id", orderController.deleteOrder.bind(orderController));

export default orderRoutes;