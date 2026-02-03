import express from "express";
import { mainRouters } from "./routes/main";
import { authRoutes } from "./routes/auth";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { MatchesRoutes } from "./routes/matches";
import { userRoutes } from "./routes/user";
import { RankingRoutes } from "./routes/ranking";

const server = express();
server.use(
  cors({
    origin: "http://localhost:3000", // A URL onde seu Next.js está rodando
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"], // Isso libera o Bearer!
    credentials: true,
  }),
);
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use(express.static("public"));
server.use("/api", mainRouters);
server.use("/api/auth", authRoutes);
server.use("/api/match/", MatchesRoutes);
server.use("/api/user/", userRoutes);
server.use("/api/ranking/", RankingRoutes);

server.listen(4444, () => {
  console.log("servidor rodando na 4444 ");
});
