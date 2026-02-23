import "./FindUsers.css";
import Header from "../components/Header";
import SideBar from "../components/sidebar"

export default function FindUsers() {
  return (
    <div className="users-page">
      <Header></Header>
      <div className="main-content">
        <SideBar></SideBar>
        {/*<!--CHAT AREA LAYOUT-->*/}
      </div>
    </div>
  );
}
