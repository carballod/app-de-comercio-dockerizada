import express from "express";
import { UserController } from "../../application/controllers/user.controller";
import { UserService } from "../../application/services/user.service";
import { UserJsonRepository } from "../persistence/user.json.repository";

const userRoutes = express.Router();
const userRepository = new UserJsonRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRoutes.get("/", userController.getAllUsers.bind(userController));
userRoutes.get("/:id", userController.getUserById.bind(userController));
userRoutes.post("/", userController.createUser.bind(userController));
userRoutes.put("/:id", userController.updateUser.bind(userController));
userRoutes.delete("/:id", userController.deleteUser.bind(userController));

export default userRoutes;