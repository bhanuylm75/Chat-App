import mongoose from "mongoose"
const message= new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  content: { type: String, trim: true },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "chat" },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
})
export default mongoose.model("message",message)