import fs from "fs/promises";
import path from "path";
import { IProductRepository } from "../repository/product.repository";
import { Product } from "../../models/product/product.interface";

const productsFile = path.join(__dirname, "../data/products.json");

export class ProductService {
  constructor(private productRepository: IProductRepository) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async addProduct(product: Omit<Product, "id">): Promise<Product> {
    return this.productRepository.save(product);
  }

  async updateProduct(
    id: string,
    product: Omit<Product, "id">
  ): Promise<Product | null> {
    return this.productRepository.update(id, product);
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.productRepository.deleteById(id);
  }
}
