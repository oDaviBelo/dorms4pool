import { Request, RequestHandler } from "express";
import { generateToken, verifyToken } from "../libs/jwt";
import { prisma } from "../libs/prisma";
import { TokenPayload } from "../types/token-payload";
import { getUserByEmail } from "./user";

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

export const verifyUser = async (req: Request) => {
  const { authorization } = req.headers;
  if (authorization) {
    const authSplit = authorization.split("Bearer ");
    if (authSplit[1]) {
      const payload = await verifyToken(authSplit[1]);
      if (payload) {
        const userEmail = (payload as TokenPayload).email;
        const user = await getUserByEmail(userEmail);
        if (user) return user;
      }
    }
  }
  return false;
};
