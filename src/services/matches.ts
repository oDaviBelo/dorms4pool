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

export const isInTheMatch = async (id: number) => {
  return await prisma.match.findFirst({
    where: { OR: [{ player1: id }, { player2: id }] },
  });
};

type setResultProps = {
  winner: number;
  second: number;
  hash: number;
};
export const setResult = async (data: setResultProps) => {
  return await prisma.match.update({
    where: { id: data.hash },
    data: {
      winnerId: data.winner,
      loserId: data.second,
    },
    select: {
      winnerId: true,
      loserId: true,
    },
  });
};
