import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "../backend/dbConfig";
import userRouter from "./modules/User/userRoute";
import chatRouter from "./modules/chat/chatRouter";
import messageRouter from "./modules/message/messageRouter";
import userAuth from "../backend/middlewares/authMiddleware";
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
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A new user just connected with id : ", socket.id);

  socket.on("message", (msg) => {
    io.emit("message", msg);
  });
  socket.on("single-message", ({ message, id }) => {
    io.to(id).emit("single-message", message);
  });

  socket.on("join-room", (to_join) => {
    socket.join(to_join);
    console.log(socket.id, "joined to room ", to_join);
  });
  socket.on("send-message-room", ({ message, toRoom }) => {
    io.to(toRoom).emit("send-message-room", message);
  });

  socket.on("disconnect", () => console.log(socket.id, " Got Disconnected..."));
});

server.listen(9000, () => {
  console.log("Listening on Port ", 9000);
});
