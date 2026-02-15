import { Router } from "express";
import * as userController from "../controllers/user";
import { privateRoute } from "../middleware/private-route";

export const userRoutes = Router();

userRoutes.get("/getUsersById", privateRoute, userController.getUsersById);
userRoutes.get("/me", privateRoute, userController.getUserByToken);

//fix middleware and route/me
