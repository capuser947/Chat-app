import mongoose from "mongoose";
const chatSchema = new mongoose.Schema(
  {
    chatName: { type: String, required: true, trim: true },
    isGroupChat: { type: Boolean, require },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true, collection: "chats" }
);
const Chat = mongoose.model("Chats", chatSchema);

export { Chat };
