import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "../backend/dbConfig";
import userRouter from "./modules/User/userRoute";
import chatRouter from "./modules/chat/chatRouter";
import messageRouter from "./modules/message/messageRouter";
import { SocketConnector } from "../backend/modules/chat/chatService";
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
// app.use(userAuth);
const Router = express.Router();
app.use("/api", Router);
Router.use("/user", userRouter);
Router.use("/chat", chatRouter);
Router.use("/message", messageRouter);
const server = http.createServer(app);
SocketConnector(server);

server.listen(9000, () => {
  console.log("Listening on Port ", 9000);
});
export default server;
