import { Category } from "../../interfaces/category.interface";
import { ICategoryRepository } from "../repository/category.repository";

export class CategoryService {
  constructor(private categoryRepository: ICategoryRepository) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }

  async createCategory(category: Omit<Category, "id">): Promise<Category> {
    return this.categoryRepository.save(category);
  }

  async updateCategory(id: string, category: Omit<Category, "id">): Promise<Category | null> {
    return this.categoryRepository.update(id, category);
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categoryRepository.deleteById(id);
  }
}