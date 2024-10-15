import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  constructor(private userService: UserService) {}

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      this.handleError(res, error, "fetching users");
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      this.handleError(res, error, "fetching user");
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const newUser = await this.userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      this.handleError(res, error, "creating user");
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const updatedUser = await this.userService.updateUser(
        req.params.id,
        req.body
      );
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      this.handleError(res, error, "updating user");
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const isDeleted = await this.userService.deleteUser(req.params.id);
      if (isDeleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      this.handleError(res, error, "deleting user");
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
