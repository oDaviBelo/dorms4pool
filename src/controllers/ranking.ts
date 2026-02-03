import { RequestHandler } from "express";
import { fetchRanking } from "../services/ranking";
export const getRankingController: RequestHandler = async (req, res) => {
  const data = await fetchRanking();
  if (!data) {
    return;
  }
  res.json({
    data,
  });
};
