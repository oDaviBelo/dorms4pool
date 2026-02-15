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
  data: Date;
  username1?: string;
};
export const createMatchData = async (data: CreateMatchProps) => {
  const users = await prisma.user.findFirst({
    where: {
      id: data.player1,
    },
    select: {
      id: true,
      name: true,
      username: true,
    },
  });
  if (!users?.username) {
    return false;
  }
  return await prisma.match.create({
    data: {
      player1: data.player1,
      hash: data.hash,
      data: data.data,
      username1: users?.username,
      username2: "Desconhecido",
    },
  });
};

type GetIntoMatchProps = {
  player2: number;
  hash: number;
};

export const getIntoMatchData = async (data: GetIntoMatchProps) => {
  const users = await prisma.user.findFirst({
    where: { id: data.player2 },
    select: {
      id: true,
      username: true,
      name: true,
    },
  });

  if (!users?.username) {
    return false;
  }
  return await prisma.match.update({
    where: { id: data.hash },
    data: {
      player2: data.player2,
      username2: users?.username,
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
  return await prisma.$transaction(async (tx) => {
    const winnerUpdate = await prisma.user.update({
      where: { id: data.winner },
      data: {
        triunfos: { increment: 1 },
      },
    });
    const loserUpdate = await prisma.user.update({
      where: { id: data.second },
      data: {
        derrotas: { increment: 1 },
      },
    });
    const matchResult = await prisma.match.update({
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
    return matchResult;
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

export const getMatches = async (userId: number) => {
  return await prisma.match.findMany({
    where: {
      OR: [{ player1: userId }, { player2: userId }],
      AND: {
        status: true,
      },
    },
    orderBy: {
      data: "desc",
    },
    include: {},
  });
};
