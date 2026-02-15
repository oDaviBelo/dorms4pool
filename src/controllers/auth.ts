import { RequestHandler, Response } from "express";
import { z } from "zod";
import { createUser, loginUser } from "../services/auth";
import { generateToken } from "../libs/jwt";
import { ExtendedRequest } from "../types/extended-request";
import bcrypt from "bcrypt";
export const signup: RequestHandler = async (req, res) => {
  console.log("Recebendo tentativa de cadastro...");

  const schema = z.object({
    name: z.string().min(2).max(15),
    email: z.string().email(),
    password: z.string().min(6),
    morador: z.boolean(),
    username: z.string(),
    data: z.coerce.date(),
  });

  const parse = schema.safeParse(req.body);

  if (!parse.success) {
    console.log("Erro de validação Zod:", parse.error.flatten().fieldErrors);
    return res.status(400).json({ error: parse.error.flatten().fieldErrors });
  }

  try {
    const { email, password, name, morador, username, data } = parse.data;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log("Iniciando criação no Prisma...");
    const newUser = await createUser({
      ...parse.data,
      password: hashedPassword,
    });

    if (!newUser) {
      return res
        .status(500)
        .json({ error: "Não foi possível criar o usuário." });
    }

    const tokenData = {
      email: newUser.email,
      id: newUser.id,
      name: newUser.name,
    };

    const token = await generateToken(tokenData);

    return res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (error: any) {
    console.error("ERRO NO PROCESSO DE SIGNUP:", error);
    return res.status(500).json({
      error: "Erro interno no servidor",
      message: error.message,
    });
  }
};
export const login: RequestHandler = async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const data = schema.safeParse(req.body);

  if (!data.success) {
    return res.status(400).json({ error: data.error.flatten().fieldErrors });
  }

  try {
    const userData = await loginUser(data.data);

    if (!userData) {
      return res.status(401).json({ err: "Credenciais Inválidas" });
    }

    const verifyPass = await bcrypt.compare(
      data.data.password,
      userData.password,
    );

    if (!verifyPass) {
      return res.status(401).json({ err: "E-mail ou senha incorretos" });
    }

    const tokenData = {
      email: userData.email,
      id: userData.id,
      name: userData.name,
    };

    const token = await generateToken(tokenData);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      //domain: ".dorms4pool.online",
      path: "/",
      maxAge: 3600000,
    });

    return res.json({
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        username: userData.username,
        morador: userData.morador,
      },
      token,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: "Erro interno no servidor",
      message: error.message,
    });
  }
};
export const validate = (req: ExtendedRequest, res: Response) => {
  res.json({ user: req.user });
};
