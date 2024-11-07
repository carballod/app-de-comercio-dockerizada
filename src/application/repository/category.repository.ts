import { Category } from "../../interfaces/category.interface";

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  save(category: Omit<Category, "id">): Promise<Category>;
  update(id: string, category: Omit<Category, "id">): Promise<Category | null>;
  deleteById(id: string): Promise<boolean>;
}