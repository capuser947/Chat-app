import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, trim: true, required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export { Message };
