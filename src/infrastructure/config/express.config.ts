import productRoutes from "../routes/product.routes";
import express from "express";

export function configureExpress(): express.Application {
  const app = express();
  app.use(express.json());
  app.use("/product", productRoutes);
  return app;
}
