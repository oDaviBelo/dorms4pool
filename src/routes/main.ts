import { Router } from "express";
import * as mainController from "../controllers/main";

export const mainRouters = Router();

mainRouters.get("/ping", mainController.ping);
