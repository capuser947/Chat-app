import express from "express";
import { handleGetAllChats } from "./ChatController";
const chatRouter = express.Router();

chatRouter.post("/", handleGetAllChats);
chatRouter.post("/addchat", handleGetAllChats);

export default chatRouter;
