//import chatModel from "../models/chat.model";
//import usermodel from "../models/user.model"
import chat from "../models/chat.model.js"
//import usermodel from "../models/user.model.js"

export const accesschat=async (req,res)=>{
  const { userId,user } = req.body;
  console.log(userId,user._id, "chat")
  

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  }).populate("users", "-password")

  if(isChat.length > 0){
    res.send(isChat[0]);

  }

  else{
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [user._id, userId],
    };

    try {
      const createdChat = await chat.create(chatData);
      const FullChat = await chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
  
  

}

export const fetchchats=async (req,res)=>{
  console.log(req.query)
  const {loggeduser}=req.query
 try{
  const chats=await chat.find({users:loggeduser}).populate("users","-password")
  res.send(chats)
 }
 catch(e){
  console.log(e)

 }

  
}





export const createGroupChat = (async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }
  console.log(users)

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.body.user);

  try {
    const groupChat = await chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.body.loggeduser,
    });

    const fullGroupChat = await chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
export const renameGroup = (async (req, res) => {
  const { chatId, chatName } = req.body;
  console.log(chatId,chatName)

  const updatedChat = await chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
export const removeFromGroup = (async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
export const addToGroup = (async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

