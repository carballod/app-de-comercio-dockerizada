import { IProductRepository } from "../../application/repository/product.repository";
import { Product as ProductInterface } from "../../interfaces/product.interface";
import { Types } from "mongoose";
import { Product } from "../schemas/product/product.schema";

export class ProductMongoRepository implements IProductRepository {
  private documentToInterface(doc: any): ProductInterface {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      price: doc.price,
      category: doc.category,
    };
  }

  async findAll(): Promise<ProductInterface[]> {
    const products = await Product.find().lean();
    return products.map((product) => this.documentToInterface(product));
  }

  async findById(id: string): Promise<ProductInterface | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const product = await Product.findById(id).lean();
    return product ? this.documentToInterface(product) : null;
  }

  async save(product: Omit<ProductInterface, "id">): Promise<ProductInterface> {
    try {
      const newProduct = new Product(product);
      const savedProduct = await newProduct.save();
      return this.documentToInterface(savedProduct);
    } catch (error) {
      throw new Error("Failed to create product");
    }
  }

  async update(
    id: string,
    productData: Partial<Omit<ProductInterface, "id">>
  ): Promise<ProductInterface | null> {
    try {
      if (!Types.ObjectId.isValid(id)) return null;

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: productData },
        { new: true }
      ).lean();

      return updatedProduct ? this.documentToInterface(updatedProduct) : null;
    } catch (error) {
      throw new Error("Failed to update product");
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) return false;
      const result = await Product.deleteOne({ _id: id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product");
    }
  }
}
