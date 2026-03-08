import "./header.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


export default function Header() {
  const { user } = useSelector((state: any) => state.userReducer);
  const navigate = useNavigate();

  console.log("HEADER user:", user);

  function getFullName() {
    const fname = user?.firstname ? user.firstname.toUpperCase() : "";
    const lname = user?.lastname ? user.lastname.toUpperCase() : "";
    return `${fname} ${lname}`.trim();
  }

  function getInitials() {
    const finitial = user?.firstname ? user.firstname.toUpperCase()[0] : "";
    const linitial = user?.lastname ? user.lastname.toUpperCase()[0] : "";
    return (finitial + linitial).trim();
  }
  // prefer profile pic from Redux `user`; fallback to initials
  return (
    <div className="app-header">
      <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
        Bruin Chat
      </div>
      <div className="app-user-profile">
        <div className="logged-user-name">{getFullName()}</div>
        <div
          className="logged-user-profile-pic"
          role="button"
          tabIndex={0}
          aria-label="Open profile"
          onClick={() => navigate("/profile")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/profile");
            }
          }}
        >
          {user?.profilePic ? (
            <img src={user.profilePic} alt="Profile" />
          ) : (
            getInitials()
          )}
        </div>
      </div>
    </div>
  );
}