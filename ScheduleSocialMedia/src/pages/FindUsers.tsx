import Header from "../components/header";
import SideBar from "../components/sidebar";
import ChatArea from "../components/chat";
import "./FindUsers.css";
//@ts-ignore
import { use, useEffect } from "react";
import { useSelector } from "react-redux";
//web socket
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

//this page represents "home page/index.js"

export default function FindUsers() {
  const { selectedChat, user } = useSelector((state: any) => state.userReducer);

  useEffect(() => {}, []);
  if (user) {
    socket.emit("join-room", user._id);
  }
  [user];

  return (
    <div className="find-users">
      <Header></Header>
      <div className="main-content">
        <SideBar socket={socket}></SideBar>
        {selectedChat && <ChatArea socket={socket}></ChatArea>}
        {/*<!--CHAT AREA LAYOUT-->*/}
      </div>
    </div>
  );
}
