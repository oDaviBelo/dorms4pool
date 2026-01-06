import { prisma } from "../libs/prisma";

type CreateUserProps = {
  name: string;
  email: string;
  password: string;
};
export const createUser = async (data: CreateUserProps) => {
  data.email = data.email.toLowerCase();
  return await prisma.user.create({
    data,
  });
};
