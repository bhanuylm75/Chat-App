import express from "express"
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv"
import path from 'path'
import { Server, Socket } from "socket.io";

import chatroute from "./routes/newchat.js"
import userroute from "./routes/userroutes.js"
import messageroute from "./routes/messageroute.js"

const app = express();
dotenv.config()
mongoose.connect("mongodb+srv://bhanuylm75:Bhanu@cluster0.dj9tozc.mongodb.net/")
app.use(cors());

app.use(express.json())

app.use("/api",userroute)
app.use("/api/chat", chatroute);
app.use("/api/message", messageroute)
const xyz="production"

const __dirname1 = path.resolve();

if (xyz === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

const serverr=app.listen(3008,()=>{
  console.log("server started")
})


const io = new Server(serverr,{
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3004",
    // credentials: true,
  },
});
io.on("connection",(socket)=>{
  console.log("connected")

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));


  socket.on("new message", (newMessageRecieved) => {
    console.log(newMessageRecieved)
    
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user?._id == newMessageRecieved.sender._id) return;

      io.emit("receievemsg", newMessageRecieved)
    });


    
  });
})