import express from "express";
import {
  handleAddChat,
  handleAddMessages,
  handleGetAllChats,
} from "./ChatController";
const chatRouter = express.Router();

chatRouter.post("/", handleGetAllChats);
chatRouter.post("/addchat", handleAddChat);
chatRouter.post("/addmessages", handleAddMessages);

export default chatRouter;
