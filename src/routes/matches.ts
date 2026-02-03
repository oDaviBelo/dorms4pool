import { Router } from "express";
import { privateRoute } from "../middleware/private-route";
import * as MatchController from "../controllers/matches";
export const MatchesRoutes = Router();

MatchesRoutes.post("/create", privateRoute, MatchController.createMatch);
MatchesRoutes.put("/enter", privateRoute, MatchController.getIntoMatch);
MatchesRoutes.put("/setWinner", privateRoute, MatchController.setWinner);
MatchesRoutes.get(
  "/getMatchUsers",
  privateRoute,
  MatchController.getMatchUsers,
);
