import mongoose from "mongoose";

const userModel= new mongoose.Schema({
  name: { type: "String", required: true },
  email: { type: "String", unique: true, required: true,unique:true },
  password: { type: "String", required: true },
  pic: {
      type: "String",
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  
})

export default mongoose.model("user",userModel)
