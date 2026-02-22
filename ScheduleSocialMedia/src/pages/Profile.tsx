import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import TopBar from "../components/TopBar";
import "./Profile.css";

export default function Profile() {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onPickProfilePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setProfilePreview(url);
  };

  return (
    <div className="app">
      <TopBar />

      <div className="layout">
        <h1 className="pageTitle">Profile</h1>

        <div className="profileHeader">
          {/* profile picture box */}
          <div className="profilePicLarge">
            {profilePreview ? (
              <img
                className="profilePicImg"
                src={profilePreview}
                alt="profile preview"
              />
            ) : null}
          </div>

          <div className="profileInfo">
            <div className="username">user_name</div>
            <div className="bio">Bio goes here</div>

            <div className="card">
              <div className="sectionTitle">Profile picture</div>
              <p className="muted">Upload a photo to set your profile picture.</p>

              {/* hidden input + button */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onPickProfilePic}
                style={{ display: "none" }}
              />

              <button
                className="primaryBtn"
                type="button"
                onClick={() => fileRef.current?.click()}
              >
                Upload Photo
              </button>
            </div>

            <div className="card">
              <div className="sectionTitle">MySchedule</div>
              <p className="muted">
                Your schedule will show here once the schedule feature is pushed.
              </p>

              {/* go to teammate schedule page */}
              <Link to="/myschedule" className="primaryBtn">
                Edit MySchedule
              </Link>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}