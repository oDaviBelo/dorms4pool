import z, { int, number, set } from "zod";
import { getMatchData } from "../services/matches";
import { Request, RequestHandler, Response } from "express";
import { getUserByEmail, getUsersByIds } from "../services/user";
import { verifyToken } from "../libs/jwt";
export const getUsersById: RequestHandler = async (req, res) => {
  console.log("CHAMOU");

  const schema = z.object({
    player1: z.string().transform((val) => parseInt(val, 10)),
    player2: z.string().transform((val) => parseInt(val, 10)),
  });
  console.log(req.query);
  const dataIds = schema.safeParse(req.query);
  if (!dataIds.success) {
    res.json({ err: "deu pau aqui" });
    return;
  }
  console.log("PASSOU DO ZOD");
  const playersIds = {
    player1: dataIds.data.player1,
    player2: dataIds.data.player2,
  };
  const data = await getUsersByIds(playersIds);

  if (!data) {
    res.status(404).json("nao achou os usuarios no bd");
    return;
  }

  res.status(200).json({ data });
};

export const getUserByToken: RequestHandler = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  // Se o token vier com Bearer (headers), limpamos. Se vier puro (cookie), usamos direto.
  const cleanToken = token.startsWith("Bearer ")
    ? token.split("Bearer ")[1]
    : token;

  const decoded = await verifyToken(cleanToken);

  if (!decoded) {
    return res.json({ error: "Erro inesperado" });
  }

  const finalData = await getUserByEmail(decoded.data.email);

  if (!finalData) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  res.json({ finalData });
};
