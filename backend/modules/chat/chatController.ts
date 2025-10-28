import { Chat } from "./chatModel";
import {
  addChat,
  addMessagesToChat,
  getAllChatsOfSingleUser,
} from "./chatService";

const handleGetAllChats = async (_: any, res: any) => {
  const chats = await Chat.find();
  return res.send({
    code: 200,
    data: chats,
  });
};
const handleAddChat = async (req: any, res: any) => {
  try {
    const chat = req.body;
    const result = await addChat(chat);
    return res.send({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.send({
      error: error.message,
    });
  }
};
const handleAddMessages = async (req: any, res: any) => {
  try {
    const params = req.params;
    const message = req.body;
    const result = await addMessagesToChat(params.chatId, message);
    return res.send({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};
const handleGetAllChatsForSingleUser = async (req: any, res: any) => {
  try {
    const params = req.params;
    console.log("params", params);
    const userId = params.userId;
    const result = await getAllChatsOfSingleUser(userId);
    return res.send({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
};

export {
  handleGetAllChats,
  handleAddChat,
  handleAddMessages,
  handleGetAllChatsForSingleUser,
};
