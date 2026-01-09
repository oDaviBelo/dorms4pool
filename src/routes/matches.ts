import { Router } from "express";
import { privateRoute } from "../middleware/private-route";
import * as MatchController from "../controllers/matches";
export const MatchesRoutes = Router();

MatchesRoutes.post("/create", privateRoute, MatchController.createMatch);
MatchesRoutes.post("/enter", privateRoute, MatchController.getIntoMatch);
