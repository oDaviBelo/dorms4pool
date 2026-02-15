import z, { int, number, set } from "zod";
import {
  getIntoMatchData,
  getMatchHash,
  isInTheMatch,
  setResult,
  getMatchData,
  getMatches,
} from "../services/matches";
import { id } from "zod/locales";
import { Request, RequestHandler, Response } from "express";
import { createMatchData } from "../services/matches";
import { ExtendedRequest } from "../types/extended-request";
import { verifyUser } from "../services/auth";
import { verifyToken } from "../libs/jwt";
import { getUserById } from "../services/user";

export const createMatch: RequestHandler = async (
  req: ExtendedRequest,
  res,
) => {
  const user = await req.cookies.token;

  if (!user) {
    return false;
  }
  const newUser = user.split("Bearer ");
  const userToken = verifyToken(newUser[1]);
  let hash = await getMatchHash();
  let hashDefault = 1;
  let newHash = 0;
  if (hash._max.id == null) {
    newHash = hashDefault;
  } else {
    newHash = hash._max.id += 1;
  }
  if (!userToken || userToken.data.id == null) {
    res.status(401).json({ err: "erro no id" });
    return;
  }
  const firstMatchData = {
    player1: userToken.data.id,
    hash: newHash.toString(),
    data: new Date(),
  };
  const setMatchData = await createMatchData(firstMatchData);

  if (!setMatchData) {
    res
      .status(402)
      .json({ err: "algum pau na hora de passar os dados no controller" });
    return;
  }
  return res.json({ data: setMatchData });
};

export const getIntoMatch: RequestHandler = async (
  req: ExtendedRequest,
  res: Response,
) => {
  const schema = z.object({
    hash: z.number(),
  });
  const data = schema.safeParse(req.body);
  if (!data.success) {
    return;
  }

  const user = await req.cookies.token;
  if (!user) {
    return;
  }
  const newUser = user.split("Bearer ");
  const userToken = await verifyToken(newUser[1]);

  if (!data) {
    res.status(401).json({ err: "pau no controller" });
    return;
  }
  if (!userToken) {
    return;
  }
  const newPlayer = {
    player2: userToken.data.id,
    hash: data.data.hash,
  };
  const verifyInMatch = await isInTheMatch(newPlayer);
  if (verifyInMatch) {
    res.json({ err: "O usuário já está na partida" });
    return;
  }
  if (userToken.data.id === undefined) {
    return;
  }
  const addPlayer = await getIntoMatchData(newPlayer);

  const Player1Data = await getUserById(addPlayer.player1);
  const Player2Data = await getUserById(newPlayer.player2);

  return res.json({
    data: addPlayer,
    player1Data: Player1Data,
    Player2Data: Player2Data,
  });
};

export const setWinner: RequestHandler = async (req, res) => {
  const schema = z.object({
    winner: z.number(),
    second: z.number(),
    hash: z.string(),
    status: z.boolean(),
  });

  const data = schema.safeParse(req.body);
  console.log(req.body);
  if (!data.success) {
    res.json({ err: data.error });
    return;
  }
  const resultData = {
    winner: data.data.winner,
    second: data.data.second,
    hash: parseInt(data.data.hash),
    status: data.data.status,
  };
  const setFinal = await setResult(resultData);

  if (!setFinal) {
    res.json({ err: "nao rolou setar" });
    return;
  }

  res.json({
    data: setFinal,
  });
};

export const getMatchUsers: RequestHandler = async (req, res) => {
  const schema = z.object({
    hash: z.string(),
  });
  const hash = schema.safeParse(req.query);
  if (!hash.success) {
    res.json({ err: "deu pau aqui" });
    return;
  }
  const getMatchDataHash = {
    hash: parseInt(hash.data.hash),
  };
  const data = await getMatchData(getMatchDataHash.hash);

  if (!data) {
    res.status(404).json("nao achou a partida no bd");
    return;
  }

  res.status(200).json({ data });
};

export const getMyMatches: RequestHandler = async (
  req: ExtendedRequest,
  res,
) => {
  const user = await req.cookies.token;

  if (!user) {
    return res.json({
      err: "sem cookies",
    });
  }
  const newUser = user.split("Bearer ");
  const userToken = await verifyToken(newUser[1]);
  if (!userToken) {
    return res.json({
      err: "cookie invalido",
    });
  }
  const data = await getMatches(userToken.data.id);
  return res.json({
    data: data,
  });
};
