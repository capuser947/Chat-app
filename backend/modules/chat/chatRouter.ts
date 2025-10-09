import express from "express";
import {
  handleAddChat,
  handleAddMessages,
  handleGetAllChats,
  handleGetAllChatsForSingleUser,
} from "./ChatController";
const chatRouter = express.Router();

chatRouter.post("/", handleGetAllChats);
chatRouter.post("/addchat", handleAddChat);
chatRouter.post("/addmessages/:chatId", handleAddMessages);
chatRouter.get("/getchats/:userId", handleGetAllChatsForSingleUser);

export default chatRouter;
