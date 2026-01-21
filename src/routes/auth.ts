import { Router } from "express";
import * as authController from "../controllers/auth";
import { privateRoute } from "../middleware/private-route";

export const authRoutes = Router();

authRoutes.post("/signup", authController.signup);
authRoutes.post("/login", authController.login);
authRoutes.post("/validate", privateRoute, authController.validate);
//fix middleware and route/me
