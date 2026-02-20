import { Link } from "react-router-dom";
import TopBar from "./components/TopBar";
import ProfileCard from "./components/ProfileCard";
import PeopleSection from "./components/PeopleSection";
import './Profile.css'

export default function Profile() {
  return (
    <div className="app">
      <TopBar />

      <div className="feed">
        <h1 className="welcome">Welcome to UCLAGRAM</h1>
        <ProfileCard />
        <PeopleSection />
      </div>

      <Link to="/messaging">
        <button>Go to Messaging</button>
      </Link>
    </div>
  );
}