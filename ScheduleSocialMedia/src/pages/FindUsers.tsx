import Header from "../components/header";
import SideBar from "../components/sidebar";
import ChatArea from "../components/chat";
import "./FindUsers.css";
import { use } from "react";
import { useSelector } from "react-redux";

//this page represents "home page/index"

export default function FindUsers() {
  const { selectedChat } = useSelector((state: any) => state.userReducer);

  return (
    <div className="find-users">
      <Header></Header>
      <div className="main-content">
        <SideBar></SideBar>
        {selectedChat && <ChatArea></ChatArea>}
        {/*<!--CHAT AREA LAYOUT-->*/}
      </div>
    </div>
  );
}
