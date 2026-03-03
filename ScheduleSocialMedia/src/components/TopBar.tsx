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
          <Link className="topbarBtn" to="/messaging">
            Messaging
          </Link>
          <Link className="topbarBtn" to="/find-users">
            Friends
          </Link>
          <button className="topbarBtn" type="button" aria-label="More">
            …
          </button>
        </nav>
      </div>
    </header>
  );
}