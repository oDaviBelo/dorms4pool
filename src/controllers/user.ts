import z, { int, number, set } from "zod";
import { getMatchData } from "../services/matches";
import { Request, RequestHandler, Response } from "express";
import { getUsersByIds } from "../services/user";

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
