import { Router } from "express";
import * as authController from "../controllers/auth";

export const authRoutes = Router();

authRoutes.get("/signup", authController.signup);
