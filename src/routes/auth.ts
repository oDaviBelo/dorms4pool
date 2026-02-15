import { Router } from "express";
import * as authController from "../controllers/auth";
import { privateRoute } from "../middleware/private-route";

export const authRoutes = Router();

authRoutes.post("/signup", authController.signup);
authRoutes.post("/login", authController.login);
authRoutes.post("/validate", privateRoute, authController.validate);
authRoutes.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".dorms4pool.online",
    path: "/",
  });
  return res.json({ success: true });
});
