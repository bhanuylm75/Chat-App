import React, { useState } from 'react'
import Mychats from '../components/Mychats'
import Sidear from '../components/Sidear'
import { Box } from "@chakra-ui/layout";
import { ChatState } from '../context/chatprovider';
import Chatbox from '../components/Chatbox';
import "./home.css"

const Chatpage = () => {
  const { user } = ChatState();
  console.log(user)
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <Sidear />}
      <Box className='sep '  w="100%" h="91.5vh" p="10px">
        {user && <Mychats fetchAgain={fetchAgain}   />}
        {user && 
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}  />
        }
        
      </Box>
    </div>
  )
}

export default Chatpage