import { Link } from "react-router-dom";
import "./TopBar.css";

export default function TopBar() {
  return (
    <header className="topbar">
      <div className="topbarInner">
        <div className="brand">BruinCord</div>

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