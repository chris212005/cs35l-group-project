// TopBar.tsx
// CHANGES:
// - Brand text changed to "BruinCord"
// - Added nav tabs: Messaging + Friend (matches teammate sketch)
// - Removed search + icon circles (you said delete add/follow + the extra stuff)

import { Link, useLocation } from "react-router-dom";
import "../pages/Profile.css"; // reusing your existing CSS file for styling

export default function TopBar() {
  const location = useLocation();

  // helper to highlight active tab
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="topbar">
      {/*  name */}
      <div className="logo">BruinCord</div>

      {/* tab nav  */}
      <div className="topTabs">
        <Link to="/messaging" className={`topTab ${isActive("/messaging") ? "activeTab" : ""}`}>
          Messaging
        </Link>

        {/* "Friend" tab -> use /find-users if that's your friend page */}
        <Link to="/find-users" className={`topTab ${isActive("/find-users") ? "activeTab" : ""}`}>
          Friends
        </Link>

        {/* tabs  */}
        <button className="topTab moreTab" type="button" aria-label="More">
          …
        </button>
      </div>
    </div>
  );
}