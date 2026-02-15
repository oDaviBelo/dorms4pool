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
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://dorms4pool.online",
        "https://www.dorms4pool.online",
        "https://dorms4pool-front.vercel.app",
      ];
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
  }),
);

server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use(express.static("public"));

server.use("/api", mainRouters);
server.use("/api/auth", authRoutes);
server.use("/api/match", MatchesRoutes);
server.use("/api/user", userRoutes);
server.use("/api/ranking", RankingRoutes);

server.get("/ping", (req, res) => {
  res.json({ pong: true, message: "Dorms4Pool API está online!" });
});

const PORT = 3000;
const HOST = "0.0.0.0";

server.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor Dorms4Pool rodando em http://${HOST}:${PORT}`);
});
