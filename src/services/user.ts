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
