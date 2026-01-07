import { generateToken } from "../libs/jwt";
import { prisma } from "../libs/prisma";

type CreateUserProps = {
  name: string;
  email: string;
  password: string;
};
export const createUser = async (data: CreateUserProps) => {
  data.email = data.email.toLowerCase();
  const exists = await prisma.user.findFirst({
    where: { email: data.email },
  });
  if (exists) {
    return false;
  }
  return await prisma.user.create({
    data,
  });
};
type LoginUserProps = {
  email: string;
  password: string;
};

export const loginUser = async (data: LoginUserProps) => {
  data.email = data.email.toLowerCase();
  const exists = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });
  if (!exists) {
    return false;
  }
  return await prisma.user.findFirst({
    where: { email: data.email, password: data.password },
  });
};
