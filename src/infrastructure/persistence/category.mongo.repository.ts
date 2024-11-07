import { Category } from "../../interfaces/category.interface";
import { ICategoryRepository } from "../../application/repository/category.repository";
import { Category as CategoryModel } from "../../infrastructure/schemas/category/category.schema";
import { Types } from "mongoose";
import { Product } from "../schemas/product/product.schema";

export class CategoryMongoRepository implements ICategoryRepository {
  private documentToInterface(doc: any): Category {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      active: doc.active,
    };
  }
  async findAll(): Promise<Category[]> {
    const categories = await CategoryModel.find().sort({ name: 1 });
    return categories.map((category) => this.documentToInterface(category));
  }

  async findById(id: string): Promise<Category | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const category = await CategoryModel.findById(id).lean();
    return category ? this.documentToInterface(category) : null;
  }

  async save(category: Omit<Category, "id">): Promise<Category> {
    try {
      const newCategory = new CategoryModel(category);
      const savedCategory = await newCategory.save();
      return this.documentToInterface(savedCategory);
    } catch (error) {
      throw new Error("Failed to create category");
    }
  }

  async update(
    id: string,
    categoryData: Partial<Omit<Category, "id">>
  ): Promise<Category | null> {
    try {
      if (!Types.ObjectId.isValid(id)) return null;
      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        id,
        { $set: categoryData },
        { new: true }
      ).lean();
      return updatedCategory ? this.documentToInterface(updatedCategory) : null;
    } catch (error) {
      throw new Error("Failed to update category");
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) return false;
      const result = await CategoryModel.deleteOne({ _id: id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw new Error("Failed to delete category");
    }
  }

}
