import "./sidebar.css";
import { useState } from "react";
import Search from "./search";
import UsersList from "./userList";

export default function SideBar({ socket }: { socket: any }) {
  const [searchKey, setSearchKey] = useState("");
  return (
    <aside className="sidebar">
      <Search searchKey={searchKey} setSearchKey={setSearchKey}></Search>
      <UsersList searchKey={searchKey} socket={socket}></UsersList>
    </aside>
  );
}
