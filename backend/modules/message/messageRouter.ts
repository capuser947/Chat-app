import express from "express";
import { addMessage, handleGetAllMessages } from "./messageController";
const messageRouter = express.Router();

messageRouter.post("/", handleGetAllMessages);
messageRouter.post("/addmessage", addMessage);

export default messageRouter;
