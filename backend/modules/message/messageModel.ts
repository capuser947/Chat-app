import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, trim: true, required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    to: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);
export { Message };
