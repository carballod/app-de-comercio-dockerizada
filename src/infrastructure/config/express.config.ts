import productRoutes from "../routes/product.routes";
import express from "express";
import userRoutes from "../routes/user.routes";

export function configureExpress(): express.Application {
  const app = express();
  app.use(express.json());
  app.use("/product", productRoutes);
  app.use("/user", userRoutes);
  return app;
}
