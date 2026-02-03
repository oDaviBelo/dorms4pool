import { number } from "zod";
import { prisma } from "../libs/prisma";

export const getMatchHash = async () => {
  return await prisma.match.aggregate({
    _max: {
      id: true,
    },
  });
};

type CreateMatchProps = {
  player1: number;
  hash: string;
};
export const createMatchData = async (data: CreateMatchProps) => {
  return await prisma.match.create({
    data: { player1: data.player1, hash: data.hash },
  });
};

type GetIntoMatchProps = {
  player2: number;
  hash: number;
};

export const getIntoMatchData = async (data: GetIntoMatchProps) => {
  return await prisma.match.update({
    where: { id: data.hash },
    data: {
      player2: data.player2,
    },
    select: {
      hash: true,
      player1: true,
      player2: true,
    },
  });
};

type isInTheMatchProps = {
  player2: number;
  hash: number;
};
export const isInTheMatch = async (data: isInTheMatchProps) => {
  return await prisma.match.findFirst({
    where: {
      hash: data.hash.toString(),
      OR: [{ player1: data.player2 }, { player2: data.player2 }],
    },
  });
};

type setResultProps = {
  winner: number;
  second: number;
  hash: number;
  status: boolean;
};
export const setResult = async (data: setResultProps) => {
  return await prisma.match.update({
    where: { id: data.hash },
    data: {
      winnerId: data.winner,
      loserId: data.second,
      status: data.status,
    },
    select: {
      winnerId: true,
      loserId: true,
      status: true,
    },
  });
};

export const getMatchData = async (hash: number) => {
  return await prisma.match.findFirst({
    where: { id: hash },
    select: {
      player1: true,
      player2: true,
      status: true,
    },
  });
};
