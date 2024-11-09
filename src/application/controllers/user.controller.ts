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
        res.json({ token: token, success: true, message: 'Login exitoso' });
      } else {
        res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }
    } catch (error) {
      next(error);
    }
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.body || typeof req.body !== 'object') {
        res.status(400).json({
          success: false,
          message: 'Datos de registro inválidos'
        });
        return;
      }
  
      console.log('Iniciando registro con datos:', {
        username: req.body.username,
        email: req.body.email
      });
  
      try {
        const existingUser = await this.userService.getUserByUsername(req.body.username);
        if (existingUser) {
          res.status(400).json({
            success: false,
            message: 'El usuario ya existe'
          });
          return;
        }
      } catch (error) {
        console.error('Error al verificar usuario existente:', error);
        res.status(500).json({
          success: false,
          message: 'Error al verificar disponibilidad del usuario'
        });
        return;
      }
  
      try {
        const newUser = await this.authService.register(req.body);
        res.status(201).json({
          success: true,
          message: 'Usuario registrado exitosamente'
        });
      } catch (error) {
        console.error('Error en el proceso de registro:', error);
        
        if (error instanceof Error && error.message.includes('requerido')) {
          res.status(400).json({
            success: false,
            message: error.message
          });
        } else {
          res.status(500).json({
            success: false,
            message: 'Error al crear el usuario. Por favor, intente nuevamente.'
          });
        }
      }
    } catch (error) {
      console.error('Error general en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, email, verificationCode, newPassword } = req.body;
      const success = await this.authService.resetPassword(username, email, verificationCode, newPassword);
      if (success) {
        res.json({ success: true, message: 'Contraseña restablecida exitosamente' });
      } else {
        res.status(400).json({ success: false, message: 'No se pudo restablecer la contraseña' });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        next(error);
      }
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
