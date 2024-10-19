import { ProductController } from "../../application/controllers/product.controller";
import { ProductService } from "../../application/services/product.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ProductJsonRepository } from "../persistence/product.json.repository";
import express from "express";

const productRoutes = express.Router();
const productRepository = new ProductJsonRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

productRoutes.use(authMiddleware);
productRoutes.get("/", productController.getAllProducts.bind(productController));
productRoutes.get("/:id", productController.getProductById.bind(productController));
productRoutes.post("/", productController.addProduct.bind(productController));
productRoutes.put("/:id", productController.updateProduct.bind(productController));
productRoutes.delete("/:id",productController.deleteProduct.bind(productController));

export default productRoutes;
