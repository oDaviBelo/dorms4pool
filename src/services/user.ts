import { prisma } from "../libs/prisma";
export const getUserByEmail = async (email: string) => {
  const userEmail = email;
  return await prisma.user.findFirst({
    where: { email: userEmail },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      derrotas: true,
      triunfos: true,
    },
  });
};

export const getUserById = async (id: number) => {
  const userId = id;
  return await prisma.user.findFirst({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
    },
  });
};
type UsersId = {
  player1: number;
  player2: number;
};
export const getUsersByIds = async (data: UsersId) => {
  return await prisma.user.findMany({
    where: {
      id: {
        in: [data.player1, data.player2],
      },
    },
    select: {
      name: true,
    },
  });
};
