import { NextFunction, RequestHandler, Response } from "express";
import { verifyUser } from "../services/auth";
import { ExtendedRequest } from "../types/extended-request";
export const privateRoute = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ err: "Token não fornecido" });
    return;
  }
  const user = await verifyUser(req.cookies.token);

  if (!user) {
    console.log(req);
    return res
      .status(401)
      .json({ err: "Token inválido ou usuário inexistente" });
  }

  req.user = user;
  next();
};
