import React, { useState,useEffect } from 'react'
import { ChatState } from '../context/chatprovider'
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import Profilemodal from './Profilemodal';
import { getSender,getSenderFull } from './config';
import Updategroupchatmodal from './Updategroupchatmodal';
import Scrollablechat from './Scrollablechat';
import "./all.css"
import axios from 'axios';
import io from "socket.io-client";

const endpoint="http://localhost:3008"
var socket, selectedChatCompare;

const Singlechat = ({fetchAgain, setFetchAgain}) => {
  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
  const toast=useToast()
  console.log(selectedChat?._id)

  console.log(user._id)
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  console.log(messages)

  useEffect(()=>{
    socket=io(endpoint)
    socket.on("connected", () => setSocketConnected(true));
    socket.emit("setup", user);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    console.log("pp")

  })



  useEffect(() => {
    console.log("logged")
    socket.on("receievemsg",(newMessageRecieved)=>{
      console.log(newMessageRecieved)

      console.log("bbbb")
      console.log(selectedChatCompare._id ,newMessageRecieved.chat._id)
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
    
      } else {
        setMessages([...messages, newMessageRecieved]);
      }

    })
    
  });

  useEffect(() => {
    fetchtmessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next`-line
  }, [selectedChat])

  const fetchtmessages= async ()=>{
    if (!selectedChat) return;
    setLoading(true);


    try {
      const { data } = await axios.get(`http://localhost:3008/api/message/${selectedChat?._id}`)
      console.log(data)
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
      
    } 
    catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      
    }


  }

  const sendMessage= async(event)=>{
    if(event.key === "Enter" && newMessage){
      try {
        const { data } = await axios.post("http://localhost:3008/api/message",{content: newMessage,
        chatId: selectedChat,userId:user._id})
        console.log(data)
        socket.emit("new message", data);
        setMessages([...messages, data]);
        
      }
      catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        
      }

    }

  }
  const typingHandler=(e)=>{
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);

      let lastTypingTime = new Date().getTime();
      var timerLength = 3000;
      setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timerLength && typing) {
          socket.emit("stop typing", selectedChat._id);
          setTyping(false);
        }
      }, timerLength);
    }

  }
  return (
    <div className='mainn example'>
    {selectedChat?(
    <>
    <div className='chat-con'>
      <IconButton
    d={{ base: "flex", md: "none" }}
    icon={<ArrowBackIcon />}
    onClick={() => setSelectedChat("")}
  />
  {!selectedChat.isGroupChat ? (<>
    {getSender(user, selectedChat.users)}
  <Profilemodal user={getSenderFull(user, selectedChat.users)}/>
  </>):(<>
   {selectedChat.chatName.toUpperCase()}
   <Updategroupchatmodal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
   </>)}</div>
   <div className='chat example'>
   {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages example">
                <Scrollablechat messages={messages} />
              </div>
            )}
   <FormControl onKeyDown={sendMessage} id="first-name" isRequired>
    {istyping? <div>Loading...</div>:("")}
   <Input w="100%"  variant="filled" id="first-name" isRequired onChange={typingHandler}/>
   </FormControl>

   </div>

    </>
   ) :(<Box d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            >
              <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
            </Box>)}</div>
  )
}

export default Singlechat