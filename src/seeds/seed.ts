import mongoose from "mongoose";
import { products, users } from "./data";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Product } from "../infrastructure/schemas/product/product.schema";
import { User } from "../infrastructure/schemas/user/user.schema";
import { Order } from "../infrastructure/schemas/order/order.schema";
import { seedOrders } from "./seedOrders";

dotenv.config();

async function seed() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error(
        "MONGODB_URI no está definido en las variables de entorno"
      );
    }

    await mongoose.connect(mongoURI);
    console.log("Conectado a MongoDB");

    await Promise.all([
      Product.deleteMany({}),
      User.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log("Base de datos limpiada");

    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} productos creados`);

    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`${createdUsers.length} usuarios creados`);

    const sampleOrders = seedOrders(createdUsers, createdProducts);
    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`${createdOrders.length} órdenes creadas`);

    console.log("Seed completado exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("Error durante el seed:", error);
    process.exit(1);
  }
}

seed();
