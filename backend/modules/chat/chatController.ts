import { Chat } from "./chatModel";

const handleGetAllChats = async (_: any, res: any) => {
  const chats = await Chat.find();
  return res.send({
    code: 200,
    data: chats,
  });
};
const addChat = async (_: any, res: any) => {
  const chats = await Chat.find();
  return res.send({
    code: 200,
    data: chats,
  });
};

export { handleGetAllChats };
