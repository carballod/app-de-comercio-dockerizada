import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user/user.interface';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;
  console.log('Token recibido:', token); 

  if (!token) {
    res.status(401).json({ message: "No autenticado" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as User;
    res.locals.user = decoded;
    console.log('Usuario decodificado:', decoded); 
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.clearCookie('token');
    res.status(401).json({ message: "Token inválido" });
  }
};
