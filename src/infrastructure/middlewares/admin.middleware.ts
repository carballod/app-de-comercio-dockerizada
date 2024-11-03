import { Request, Response, NextFunction } from "express";
import { User } from "../../interfaces/user.interface";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = res.locals.user as User;

  if (user && user.isAdmin) {
    next();
  } else {
    res.status(403).json({
      message: "Acceso denegado. Se requieren permisos de administrador.",
    });
  }
};
