import React from 'react'
import { ViewIcon } from "@chakra-ui/icons";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from '../context/chatprovider';
import Userbadge from './Userbadge';
import Userlist from './Userlist';

const Updategroupchatmodal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = ChatState();

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();
  const handleRemove=()=>{

  }
  const handleRename=async ()=>{
    if (!groupChatName) return;

    try {
      const {data}  = await axios.put("http://localhost:3008/api/chat/rename", {
        chatId: selectedChat._id,
        chatName: groupChatName,
      },);

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      //setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      
    } catch (error) {

      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
      
    }
    setGroupChatName("");

  }
  const handleSearch= async (query)=>{
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      const {data}  = await axios.get(`http://localhost:3008/api/alluser?search=${search}`);
      
    } catch (error) {
      
    }

  }
  const handleAddUser=()=>{

  }
  return (
    <>
    <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <Userbadge
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl d="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <Userlist
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
    </>
  )
}

export default Updategroupchatmodal
