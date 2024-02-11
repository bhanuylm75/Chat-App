import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

import Login from "../components/Login";
import Signup from "../components/Signup";

import React, { useState } from 'react'
import "./home.css"
import axios from "axios"
import { useHistory } from "react-router-dom";

import { useToast } from "@chakra-ui/react";
import { ChatState } from '../context/chatprovider';

const Home = () => {
  const { setUser } = ChatState();
  const history = useHistory();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  console.log("h")


  const onlogin= async ()=>{
    setLoading(true);
    console.log(9)

    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try{
      const a={email,password}
      const {data } = await axios.post("http://localhost:3008/api/login",a);
      console.log(data)
      
    

      if(data?._id){
        console.log(data)
        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setUser(data)
        

        localStorage.setItem("userInfo", JSON.stringify(data));
        history.push("/chats")
      }
      //setUser(data);

    }
    catch(error){
      toast({
        title: "Error Occured!",
        description: error?.response?.data?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);

    }

    
  }
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home