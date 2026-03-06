import { Link } from "react-router-dom";
import "./TopBar.css";
import bruinCordLogo from "../assets/BruinCordLogo.png";

export default function TopBar() {
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
        </nav>
      </div>
    </header>
  );
}