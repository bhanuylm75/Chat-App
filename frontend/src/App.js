import React from 'react'
import "./App.css"
import Home from './pages/home';
import Chatpage from './pages/chatpage';
import { Route } from "react-router-dom";

const App = () => {
  return (
    <div className="App example">
      <Route path="/" component={Home} exact />
      <Route path="/chats" component={Chatpage} />
    </div>


  )
}

export default App