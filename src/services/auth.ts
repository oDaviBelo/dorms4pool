import { Request, RequestHandler } from "express";
import { generateToken, verifyToken } from "../libs/jwt";
import { prisma } from "../libs/prisma";
import { TokenPayload } from "../types/token-payload";
import { getUserByEmail } from "./user";

type CreateUserProps = {
  name: string;
  email: string;
  password: string;
  morador: boolean;
  username: string;
  data: Date;
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
  const emailLower = data.email.toLowerCase();
  console.log("email no services:", emailLower);

  const user = await prisma.user.findFirst({
    where: {
      email: emailLower,
    },
  });

  if (!user) {
    return false;
  }

  return user;
};
export const verifyUser = async (token: string) => {
  if (!token) return false;

  // Tenta verificar o token direto (porque no Cookie ele vem sem "Bearer")
  let payload = verifyToken(token);

  // Se falhar, tenta o split (caso você ainda use Authorization Header em algum lugar)
  if (!payload && token.includes("Bearer ")) {
    const authSplit = token.split("Bearer ");
    payload = verifyToken(authSplit[1]);
  }

  if (payload && payload.data) {
    const userEmail = payload.data.email;
    const user = await getUserByEmail(userEmail);
    if (user) return user;
  }

  return false;
};
