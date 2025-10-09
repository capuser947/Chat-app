import { Server } from "socket.io";
import { Chat } from "./chatModel";
import mongoose from "mongoose";
import { Message } from "../message/messageModel";
const SocketConnector = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      console.log(socket.id, "id DISCONNECTED..");
    });

    socket.on("join-room", (to_join) => {
      socket.join(to_join);
    });
    socket.on("private-message", (message) => {
      if (message.from == message.to[0]) {
        io.to(message.from).emit("private-message", message);
      }
      io.to(message.to[0]).emit("private-message", message);
      socket.emit("private-message", message);
    });
  });
};

const addChat = async (chat: any) => {
  try {
    const uniqueParticipants = [...new Set([chat.from, chat.to])];

    const existingChat = await Chat.findOne({
      isGroupChat: false,
      participants: {
        $all: uniqueParticipants.map((id) => new mongoose.Types.ObjectId(id)),
        $size: uniqueParticipants.length,
      },
    })
      .populate("participants", "name email")
      .populate("messages");

    if (!existingChat) {
      const res = await Chat.insertOne({
        isGroupChat: false,
        participants: chat.from == chat.to ? [chat.from] : [chat.from, chat.to],
        messages: [],
      });
      const result = await Chat.findOne({ _id: res._id })
        .populate("participants", "name email")
        .populate("messages");
      return result;
    } else {
      return existingChat;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const addMessagesToChat = async (chatId: string, message: string) => {
  try {
    const res = await Message.insertOne(message);
    const updated = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { messages: res._id } },
      { new: true }
    );
    return res;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};
const getAllChatsOfSingleUser = async (userId: string) => {
  console.log("USERID", userId);
  try {
    const myChats = await Chat.find({
      participants: { $in: [userId] },
    }).populate("participants", "name email");
    return myChats;
  } catch (error) {}
};
export { SocketConnector, addChat, addMessagesToChat, getAllChatsOfSingleUser };
