import chatModel from "../models/chat.model.js"

import messagemodal from "../models/message.model.js"
import usermodel from "../models/user.model.js"

export const allMessages = async (req, res) => {
  console.log(req.params.chatId)
  try {
    const messages = await messagemodal.find({ chat: req.params.chatId }).populate("sender", "name pic email")
    .populate("chat");
    ;
      
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

export const sendMessage= async(req,res)=>{

  const { content, chatId,userId} = req.body;

  //console.log(content)

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: userId,
    content: content,
    chat: chatId,
  };

  try {
    var message = await messagemodal.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    //message = await message.populate("chat");

    

    const a =await chatModel.findByIdAndUpdate(req.body.chatId, { latestMessage: message })
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }

}