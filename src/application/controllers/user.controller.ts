import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";

export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, password } = req.body;
      const token = await this.authService.login(username, password);
      if (token) {
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        res.json({ success: true, message: 'Login exitoso' });
      } else {
        res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }
    } catch (error) {
      next(error);
    }
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const existingUser = await this.userService.getUserByUsername(req.body.username);
      if (existingUser) {
        res.status(400).json({ success: false, message: 'El usuario ya existe' });
        return;
      }
      const newUser = await this.authService.register(req.body);
      res.status(201).json({ success: true, message: 'Usuario registrado exitosamente' });
    } catch (error) {
      next(error);
    }
  }

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, newPassword } = req.body;
      const success = await this.authService.resetPassword(username, newPassword);
      if (success) {
        res.json({ success: true, message: 'Contraseña restablecida exitosamente' });
      } else {
        res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
    } catch (error) {
      next(error);
    }
  }

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.clearCookie('token');
      res.json({ success: true, message: 'Sesión cerrada exitosamente' });
    } catch (error) {
      next(error);
    }
  }

  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      next(error);
    }
  }

  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updatedUser = await this.userService.updateUser(req.params.id, req.body);
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      next(error);
    }
  }

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isDeleted = await this.userService.deleteUser(req.params.id);
      if (isDeleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      next(error);
    }
  }
}
