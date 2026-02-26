import Header from "../components/header";
import SideBar from "../components/sidebar";
import "./FindUsers.css";

//this page represents "home page/index"

export default function FindUsers() {
  return (
    <div className="find-users">
      <Header></Header>
      <div className="main-content">
        <SideBar></SideBar>
        {/*<!--CHAT AREA LAYOUT-->*/}
      </div>
    </div>
  );
}
