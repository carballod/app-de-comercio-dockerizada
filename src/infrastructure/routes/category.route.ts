import express from "express";
import { CategoryController } from "../../application/controllers/category.controller";
import { CategoryService } from "../../application/services/category.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { CategoryMongoRepository} from "../persistence/category.mongo.repository";

  const categoryRoutes = express.Router();

  const categoryRepository = new CategoryMongoRepository();
  const categoryService = new CategoryService(categoryRepository);
  const categoryController = new CategoryController(categoryService);

  categoryRoutes.use(authMiddleware);

  categoryRoutes.get("/", categoryController.getAllCategories.bind(categoryController));
  categoryRoutes.get("/:id", categoryController.getCategoryById.bind(categoryController));

  categoryRoutes.post("/", adminMiddleware, categoryController.createCategory.bind(categoryController));
  categoryRoutes.put("/:id", adminMiddleware, categoryController.updateCategory.bind(categoryController));
  categoryRoutes.delete("/:id", adminMiddleware, categoryController.deleteCategory.bind(categoryController));


export default categoryRoutes;
