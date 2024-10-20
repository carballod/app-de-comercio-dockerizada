import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

export class ProductController {
  constructor(private productService: ProductService) {}
  
  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error) {
      this.handleError(res, error, "fetching products");
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const product = await this.productService.getProductById(req.params.id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      this.handleError(res, error, "fetching product");
    }
  }

  async addProduct(req: Request, res: Response) {
    try {
      const newProduct = await this.productService.addProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      this.handleError(res, error, "adding product");
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const updatedProduct = await this.productService.updateProduct(
        req.params.id,
        req.body
      );

      if (updatedProduct) {
        res.json(updatedProduct);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      this.handleError(res, error, "updating product");
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const isDeleted = await this.productService.deleteProduct(req.params.id);
      if (isDeleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      this.handleError(res, error, "deleting product");
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
