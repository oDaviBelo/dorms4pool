import { RequestHandler, Response } from "express";
import { z } from "zod";
import { createUser, loginUser } from "../services/auth";
import { generateToken } from "../libs/jwt";
import { ExtendedRequest } from "../types/extended-request";
import bcrypt from "bcrypt";
export const signup: RequestHandler = async (req, res) => {
  console.log("chegou");
  const schema = z.object({
    name: z.string().max(15),
    email: z.string().email(),
    password: z.string(),
  });
  const data = schema.safeParse(req.body);
  if (!data.success) {
    res.json({ error: data.error.flatten().fieldErrors });
    return;
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.data.password, saltRounds);
  console.log("newpass: ", hashedPassword);
  data.data.password = hashedPassword;
  const newUser = await createUser(data.data);

  if (!newUser) {
    res.json({ err: "Erro services" });
    return;
  }

  const tokenData = {
    email: newUser.email,
    id: newUser.id,
    name: newUser.name,
  };

  const token = await generateToken(tokenData);

  res.json({
    user: {
      id: newUser.id,
      name: newUser.name,
      password: newUser.password,
    },
    token: token,
  });
};

export const login: RequestHandler = async (req, res) => {
  const schema = z.object({
    email: z.string(),
    password: z.string(),
  });
  const data = schema.safeParse(req.body);

  if (!data.success) {
    res.json({ error: data.error.flatten().fieldErrors });
    return;
  }
  const userData = await loginUser(data.data);
  console.log(userData);
  if (!userData) {
    res.status(401).json({ err: "Credenciais Inválidas" });
    return;
  }
  const verifyPass = await bcrypt.compare(
    data.data.password,
    userData.password,
  );
  if (!verifyPass) {
    return res.status(401).json({ err: "nao autorizado, senha errada " });
  }
  const tokenData = {
    email: userData.email,
    id: userData.id,
  };

  const token = await generateToken(tokenData);
  res.cookie("token", `Bearer ${token}`, {
    httpOnly: true,
    secure: false, //process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 3600000,
  });
  res.json({
    user: {
      email: userData.email,
      password: userData.password,
    },
    token,
  });
};

export const validate = (req: ExtendedRequest, res: Response) => {
  res.json({ user: req.user });
};
