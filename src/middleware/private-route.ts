import { NextFunction, RequestHandler, Response } from "express";
import { verifyUser } from "../services/auth";
import { ExtendedRequest } from "../types/extended-request";
export const privateRoute = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  //const token = req.cookies.token;
  const user = await verifyUser(req);
  if (!user) {
    res.status(401).json({ err: "Usuario nao encontrado" });
    return;
  }
  req.user = user;

  next();
};
