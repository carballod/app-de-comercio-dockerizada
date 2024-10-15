import { Product } from "../../models/product/product.interface";

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  save(product: Omit<Product, "id">): Promise<Product>;
  update(id: string, product: Omit<Product, "id">): Promise<Product | null>;
  deleteById(id: string): Promise<boolean>;
}
