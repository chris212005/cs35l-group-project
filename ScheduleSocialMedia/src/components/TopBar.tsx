import { Link, useNavigate } from "react-router-dom";
import "./TopBar.css";
import bruinCordLogo from "../assets/BruinCordLogo.png";

export default function TopBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbarInner">
        <img
          src={bruinCordLogo}
          alt="BruinCord"
          className="topbarLogo"
        />

        <nav className="topbarNav">
          <Link className="topbarBtn" to="/find-users">
            Friends
          </Link>

          <button type="button" className="logoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}