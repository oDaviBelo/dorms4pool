import { Request, RequestHandler, Response } from "express";
export const ping = (req: Request, res: Response) => {
  return res.json({ ping: true });
};
