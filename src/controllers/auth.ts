import { RequestHandler, Response } from "express";
import { z } from "zod";
import { createUser, loginUser } from "../services/auth";
import { generateToken } from "../libs/jwt";
import { ExtendedRequest } from "../types/extended-request";
export const signup: RequestHandler = async (req, res) => {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  });
  const data = schema.safeParse(req.body);
  if (!data.success) {
    res.json({ error: data.error.flatten().fieldErrors });
    return;
  }
  const newUser = await createUser(data.data);

  if (!newUser) {
    res.json({ err: "Erro services" });
    return;
  }
  const payload = {
    email: newUser.email,
    password: newUser.password,
  };
  const token = await generateToken(data.data.email);

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

  if (!userData) {
    res.json({ err: "Credenciais Inválidas" });
    return;
  }
  const token = await generateToken(data.data.email);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600000,
  });
  res.json({
    user: {
      email: userData.email,
      password: userData.password,
    },
  });
};

export const validate = (req: ExtendedRequest, res: Response) => {
  res.json({ user: req.user });
};
