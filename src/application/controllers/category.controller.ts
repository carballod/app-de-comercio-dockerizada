import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener categorías" });
    }
  }
  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);
      if (category) {
        res.json(category);
      } else {
        res.status(404).json({ message: "Categoría no encontrada" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error al obtener categoría" });
    }
  }

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "Error al crear categoría" });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await this.categoryService.updateCategory(req.params.id, req.body);
      if (!category) {
        res.status(404).json({ message: "Categoría no encontrada" });
        return;
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar categoría" });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.categoryService.deleteCategory(req.params.id);
      if (!result) {
        res.status(404).json({ message: "Categoría no encontrada" });
        return;
      }
      res.json({ message: "Categoría eliminada exitosamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar categoría" });
    }
  }

  private handleError(res: Response, error: unknown, message: string) {
    console.error(`Error in ${message}:`, error);
    res.status(500).json({
      message: `Error ${message.toLowerCase()}`,
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
