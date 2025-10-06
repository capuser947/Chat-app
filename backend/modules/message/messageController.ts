import { Message } from "./messageModel";

const handleGetAllMessages = async (_: any, res: any) => {
  const chats = await Message.find();
  return res.send({
    code: 200,
    data: chats,
  });
};
const addMessage = async (_: any, res: any) => {
  const chats = await Message.find();
  return res.send({
    code: 200,
    data: chats,
  });
};

export { handleGetAllMessages, addMessage };
