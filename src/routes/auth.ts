import { Router } from "express";
import * as authController from "../controllers/auth";
import { privateRoute } from "../middleware/private-route";

export const authRoutes = Router();

authRoutes.get("/signup", authController.signup);
authRoutes.get("/login", authController.login);
authRoutes.post("/validate", privateRoute, authController.validate);
//fix middleware and route/me
