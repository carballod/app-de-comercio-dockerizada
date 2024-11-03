import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../interfaces/user.interface";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let token = req.cookies.token;
  console.log("Token recibido:", token);

  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/reset-password",
    "/api/user/login",
    "/api/user/register",
    "/api/user/reset-password",
  ];

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as User;
      res.locals.user = decoded;
      console.log("Usuario decodificado:", decoded);
    } catch (error) {
      console.error("Error al verificar el token:", error);
      res.clearCookie("token");
    }
  }

  if (publicRoutes.includes(req.path)) {
    return next();
  }

  if (!res.locals.user) {
    if (req.xhr || req.headers.accept?.includes("json")) {
      res.status(401).json({ message: "No autenticado" });
    } else {
      res.redirect("/login");
    }
    return;
  }

  next();
};
