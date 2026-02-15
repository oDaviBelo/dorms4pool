import { Router } from "express";
import { privateRoute } from "../middleware/private-route";
import * as RankingController from "../controllers/ranking";

export const RankingRoutes = Router();

RankingRoutes.get("/getRanking", RankingController.getRankingController);
