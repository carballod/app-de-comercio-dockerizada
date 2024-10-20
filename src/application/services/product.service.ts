import fs from "fs/promises";
import path from "path";
import { IProductRepository } from "../repository/product.repository";
import { Product } from "../../models/product/product.interface";


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

  async getFilteredProducts({
    category = [],
    sortBy,
    keyword
  }: {
    category?: string[];
    sortBy?: string;
    keyword?: string;
  }): Promise<Product[]> {
    let filteredProducts = await this.productRepository.findAll();

    if (category.length > 0 && category.length !== (await this.getCategories()).length) {
      filteredProducts = filteredProducts.filter(product => category.includes(product.category));
    }

    if (keyword) {
      const regex = new RegExp(keyword, 'i');
      filteredProducts = filteredProducts.filter(product => 
        regex.test(product.name) || regex.test(product.description)
      );
    }

    if (sortBy) {
      filteredProducts.sort((a, b) => {
        if (sortBy === 'price_asc') {
          return a.price - b.price;
        } else if (sortBy === 'price_desc') {
          return b.price - a.price;
        }
        return 0;
      });
    }

    return filteredProducts;
  }

  async getCategories(): Promise<string[]> {
    const products = await this.productRepository.findAll();
    const categories = new Set(products.map(product => product.category));
    return Array.from(categories);
  }
}
