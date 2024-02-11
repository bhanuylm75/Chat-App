import { Box,Button,Text,MenuButton,Menu, MenuList,MenuItem,Input,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  MenuDivider,} from '@chakra-ui/react'
import Chatloading from './Chatloading';
import { useDisclosure } from "@chakra-ui/hooks";
import Profilemodal from './Profilemodal';
import {BellIcon,ChevronDownIcon} from "@chakra-ui/icons"
import { useToast } from '@chakra-ui/react'
import "./sidebar.css"
import { Avatar } from "@chakra-ui/avatar";
import axios from "axios"
import Userlist from './Userlist';
import { ChatState } from '../context/chatprovider';
import { useHistory } from "react-router-dom";


import React, { useState } from 'react'

const Sidear = () => {
  const [search, setSearch] = useState()
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const {
    setSelectedChat,
    user,
    chats,
    setChats
  } = ChatState();
  console.log(user)
  console.log("jkwenckjwenckjewcnkjwlecnwkje")

  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()


  const accessChat=async (userId)=>{
    console.log("clicked")
    const { data } = await axios.post("http://localhost:3008/api/chat/",{ userId,user});
    setSelectedChat(data)
    console.log(data)
    if (!chats?.find((c) => c._id === data._id)) setChats([data, ...chats]);
    console.log(data)

  }

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const handlesearch=async()=>{
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try{
      setLoading(true);


      const { data } = await axios.get(`http://localhost:3008/api/alluser?search=${search}`, {
        params: {
          loggeduser: user?._id,
        },
      });
      console.log(data)

      setLoading(false);
      setSearchResult(data);

    }
    catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }


  }
  return (
    <>
      <Box className='side-con'>
      <Button variant="ghost" width="15%" onClick={onOpen}>
      <Text d={{ base: "none", md: "flex" }} px={4}>
        Search User
      </Text>
      <i className="fas fa-search"></i>      
      </Button>
          <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div className='menu'>
        <Menu>
        <MenuButton bg="white" mr={2}  >
          <BellIcon  fontSize="xl"  />
        </MenuButton> 
        </Menu>
        <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
        <Avatar mr={1}
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
        </MenuButton> 
        <MenuList>
          <Profilemodal user={user}>
          <MenuItem >My Profile</MenuItem>
          </Profilemodal>
          <MenuDivider/>
          <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
        </div>
        
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader>
              search users
            </DrawerHeader>
            <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handlesearch} >Go</Button>
            </Box>
            {loading ? (
              <Chatloading />
            ) : (
              searchResult?.map((user) => (
                <Userlist
                  key={user._id}
                  handleFunction={() => accessChat(user._id)}
                  user={user}
                />
              ))
            )}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>

      </Drawer>
      
    </>
  )
}

export default Sidear