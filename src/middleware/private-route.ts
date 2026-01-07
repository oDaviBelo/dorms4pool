import { RequestHandler } from "express";
import { verifyToken } from "../libs/jwt";
export const privateRoute: RequestHandler = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ err: "não autorizado" });

  const decoded = await verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ err: "credenciais invalidas" });
  }
  next();
};
