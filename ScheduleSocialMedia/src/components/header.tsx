import "./header.css";
import { useSelector } from "react-redux";

export default function Header() {
  const { user } = useSelector((state: any) => state.userReducer);
  console.log(user);

  function getFullName() {
    let fname = user?.firstname.toUpperCase();
    let lname = user?.lastname.toUpperCase();
    return fname + " " + lname;
  }

  function getInitials() {
    let finitial = user?.firstname.toUpperCase()[0];
    let linitial = user?.lastname.toUpperCase()[0];
    return finitial + linitial;
  }
  return (
    <div className="app-header">
      <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
        Bruin Chat
      </div>
      <div className="app-user-profile">
        <div className="logged-user-name">{getFullName()}</div>
        <div className="logged-user-profile-pic">{getInitials()}</div>
      </div>
    </div>
  );
}
