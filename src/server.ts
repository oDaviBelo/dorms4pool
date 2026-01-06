import express from "express";
import { mainRouters } from "./routes/main";
import { authRoutes } from "./routes/auth";
import bodyParser from "body-parser";
import cors from "cors";

const server = express();
server.use(cors());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use(express.static("public"));
server.use("/api", mainRouters);
server.use("/api/auth", authRoutes);

server.listen(4444, () => {
  console.log("servidor rodando na 4444 ");
});
