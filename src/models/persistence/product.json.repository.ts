import fs from "fs/promises";
import path from "path";
import { IProductRepository } from "../../application/repository/product.repository";
import { Product } from "../product/product.interface";
const productsFile = path.join(__dirname, "../../../data/products.json");

export class ProductJsonRepository implements IProductRepository {
  async findAll(): Promise<Product[]> {
    const data = await fs.readFile(productsFile, "utf-8");
    return JSON.parse(data);
  }

  async findById(id: string): Promise<Product | null> {
    const products = await this.findAll();
    return products.find((product) => product.id === id) || null;
  }

  async save(product: Omit<Product, "id">): Promise<Product> {
    try {
      const products = await this.findAll();

      const newProduct = { ...product, id: Date.now().toString() };
      products.push(newProduct);

      await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      throw new Error("Failed to create product");
    }
  }

  async update(
    id: string,
    product: Omit<Product, "id">
  ): Promise<Product | null> {
    try {
      const products = await this.findAll();
      const index = products.findIndex((product) => product.id === id);

      if (index === -1) return null;

      const updatedProduct = { ...products[index], ...product, id };
      products[index] = updatedProduct;

      await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
      return updatedProduct;
    } catch (error) {
      throw new Error("Failed to update product");
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const products = await this.findAll();
      const initialLength = products.length;
      const updatedProducts = products.filter((product) => product.id !== id);

      if (updatedProducts.length === initialLength) return false;

      await fs.writeFile(
        productsFile,
        JSON.stringify(updatedProducts, null, 2)
      );

      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product");
    }
  }
}
