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
    console.log("A new user just connected with id : ", socket.id);
    socket.on("disconnect", () => {
      console.log(socket.id, "id DISCONNECTED..");
    });

    socket.on("join-room", (to_join) => {
      socket.join(to_join);
      console.log(socket.id, `joined to room ${to_join}`);
    });
    socket.on("private-message", (message) => {
      console.log("Message Received : ", message);
      io.to(message.to[0]).emit("private-message", message);
      socket.emit("private-message", message);
    });
  });
};
const a: any = [];
const addChat = async (chat: any) => {
  try {
    console.log("I am inside chat", chat);

    const existingChat = await Chat.findOne({
      isGroupChat: false,
      participants: {
        $all: [chat.from, chat.to],
      },
    })
      .populate("participants")
      .populate("messages");
    console.log("EXISTINGCHAT", existingChat);

    if (!existingChat) {
      const res = await Chat.insertOne({
        isGroupChat: false,
        participants: [chat.from, chat.to],
        messages: [],
      });
      const result = await Chat.findOne({ _id: res._id })
        .populate("participants")
        .populate("messages");
      return result;
    } else {
      console.log("EXISTINGCHAT", existingChat);
      return existingChat;
    }
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

const addMessagesToChat = async (id: string, message: string) => {
  console.log("I am called");
  try {
    const res = await Message.insertOne(message);
    await Chat.findByIdAndUpdate(
      id,
      { $addToSet: { participants: id } },
      { new: true }
    );
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};
export { SocketConnector, addChat, addMessagesToChat };
