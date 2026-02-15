import { NextFunction, Response } from "express";
import { verifyUser } from "../services/auth";
import { ExtendedRequest } from "../types/extended-request";

export const privateRoute = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  // 1. Tenta pegar o token do cookie
  const token = req.cookies?.token;

  if (!token) {
    console.warn("[AUTH] Acesso negado: Cookie 'token' não encontrado.");
    return res.status(401).json({ err: "Token não fornecido" });
  }

  try {
    // 2. Chama a verificação (que valida o JWT e busca no banco)
    const user = await verifyUser(token);

    if (!user) {
      console.error(
        "[AUTH] Usuário não encontrado no banco para o token fornecido.",
      );
      return res
        .status(401)
        .json({ err: "Token inválido ou usuário inexistente" });
    }

    // 3. Sucesso: anexa o usuário à requisição
    req.user = user;
    return next();
  } catch (error: any) {
    // 4. Log detalhado do erro para debug na VPS
    console.error("[AUTH] Erro crítico na validação:", error.message || error);

    return res.status(401).json({
      err: "Token inválido ou usuário inexistente",
      debug: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
