import { Server } from "socket.io";
import { Chat } from "./chatModel";
import { TMessage, Message } from "../message/messageModel";
import CryptoJS from "crypto-js";
import { decryptMessage } from "../chat/utils/encryptAndDecrypt";
import mongoose from "mongoose";

const SocketConnector = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3001",
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

    var existingChat: any = await Chat.findOne({
      isGroupChat: false,
      participants: {
        $all: uniqueParticipants.map((id) => new mongoose.Types.ObjectId(id)),
        $size: uniqueParticipants.length,
      },
    })
      .populate("messages")
      .populate("participants", "name email");

    if (!existingChat) {
      const res = await Chat.insertOne({
        isGroupChat: false,
        participants: chat.from == chat.to ? [chat.from] : [chat.from, chat.to],
        messages: [],
      });
      existingChat = await Chat.findById(res._id)
        .populate("messages")
        .populate("participants", "name email");
    }
    console.log("existingChat", existingChat);
    const decryptedMessages = [];
    // console.log("MMMMMMM");
    for (const m of existingChat.messages || []) {
      try {
        console.log("MMMMMMM");
        const decryptedBytes = decryptMessage(m.encryptedMessage);
        if (!decryptedBytes) continue;

        const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedString) continue;

        const decryptedObject = JSON.parse(decryptedString);
        decryptedMessages.push(decryptedObject);
      } catch (err) {
        console.error("Error decrypting message:", err);
      }
    }
    console.log("decryptedMessages", decryptedMessages);
    // Replace encrypted messages with decrypted ones
    existingChat.messages = decryptedMessages;
    console.log(existingChat);
    return existingChat;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const addMessagesToChat = async (chatId: string, message: TMessage) => {
  try {
    const key = process.env.CRYPTO_KEY;
    const iv = process.env.CRYPTO_IV;
    if (!key || !iv) {
      throw new Error("Missing CRYPTO_KEY or CRYPTO_IV in environment");
    }
    const keyWA = CryptoJS.enc.Utf8.parse(key);
    const ivWA = CryptoJS.enc.Utf8.parse(iv);
    const encryptedText = CryptoJS.AES.encrypt(JSON.stringify(message), keyWA, {
      iv: ivWA,
    }).toString();
    message.encryptedMessage = encryptedText;

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
  } catch (error) {
    console.log(error);
  }
};
export { SocketConnector, addChat, addMessagesToChat, getAllChatsOfSingleUser };
