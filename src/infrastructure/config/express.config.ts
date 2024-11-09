import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import userRoutes from "../routes/user.routes";
import productRoutes from "../routes/product.routes";
import orderRoutes from "../routes/order.routes";
import categoryRoutes from "../routes/category.route";
import viewRoutes from "../routes/view.routes";
import { authMiddleware } from "../middlewares/auth.middleware"; 

export function configureExpress(): express.Application {
  const app = express();

  app.set("views", path.join(__dirname, "../../../src/application/views"));
  app.set("view engine", "pug");

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, "../../../public")));
  app.use(cookieParser());


  app.use((req, res, next) => {
    console.log('Path:', req.path);
    console.log('res.locals.user:', res.locals.user);
    next();
  });
  app.use("/", viewRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/product", productRoutes);
  app.use("/api/order", orderRoutes);  
  app.use("/api/category", categoryRoutes);  

  return app;
}
