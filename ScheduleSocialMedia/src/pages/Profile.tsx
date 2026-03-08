import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MySchedule from "./MySchedule";
import "./Profile.css";
import TopBar from "../components/TopBar";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/usersSlice";

export default function Profile() {

  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.userReducer.user);
  const dispatch = useDispatch();
  console.log("PROFILE currentUser =", currentUser);

  //Just for capitalizing the first letter of first name and last name
  function capitalize(name?: string) {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  // ---------- Profile picture ----------
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // ---------- Bio ----------
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [draftBio, setDraftBio] = useState("");

  // initialize from Redux currentUser (populated by ProtectedRoute)
  useEffect(() => {
    if (currentUser) {
      if (currentUser.profilePic) {
        setProfilePic(currentUser.profilePic);
      }
      if (currentUser.bio) {
        setBio(currentUser.bio);
        setDraftBio(currentUser.bio);
      }
    }
  }, [currentUser]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // only allow images
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setProfilePic(dataUrl);

      // Persist to server
      (async () => {
        try {
          const token = localStorage.getItem("token");
          const resp = await fetch("/api/user/update-profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ profilePic: dataUrl }),
          });
          const json = await resp.json();
          if (json && json.success) {
            dispatch(setUser(json.data));
          } else {
            // server didn't return success, keep the selected image in local UI
            setProfilePic(dataUrl);
          }
        } catch (error) {
          console.error("Error updating profile picture:", error);
          // keep the selected image locally on error
          setProfilePic(dataUrl);
        }
      })();
    };
    reader.readAsDataURL(file);

    // reset so selecting same file again still fires onChange
    e.target.value = "";
  };

  const handleStartEditBio = () => {
    setDraftBio(bio);
    setEditingBio(true);
  };

  const handleSaveBio = () => {
    const cleaned = draftBio.trim();
    setBio(cleaned);
    setEditingBio(false);

    // persist bio to server
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const resp = await fetch("/api/user/update-profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ bio: cleaned }),
        });
        const json = await resp.json();
        if (json && json.success) {
          dispatch(setUser(json.data));
          // updated user saved; update local state
          setBio(json.data.bio || cleaned);
        } else {
          // server didn't return success: keep local state
          setBio(cleaned);
        }
      } catch (error) {
        console.error("Error updating bio:", error);
        // keep local state on error
        setBio(cleaned);
      }
    })();
  };

  const handleCancelBio = () => {
    setDraftBio(bio);
    setEditingBio(false);
  };

  return (
    <>
      {/* ✅ Put TopBar back */}
      <TopBar />

      <div className="app">
        <div className="layout">
          <h1 className="pageTitle">Profile</h1>

          <div className="profileHeader">
            <div className="profilePicLarge">
              {profilePic ? (
                <img className="profilePicImg" src={profilePic} alt="Profile" />
              ) : null}
            </div>

            <div className="profileInfo">
              <div className="username">{capitalize(currentUser?.firstname || "")} {capitalize(currentUser?.lastname || "")}
              </div>

              {!editingBio ? (
                <>
                  <div className="bio">{bio || "Bio goes here"}</div>
                  <button
                    className="primaryBtn"
                    type="button"
                    onClick={handleStartEditBio}
                  >
                    📝 Edit Bio
                  </button>
                </>
              ) : (
                <>
                  <div style={{ marginTop: 10 }}>
                    <textarea
                      value={draftBio}
                      onChange={(e) => setDraftBio(e.target.value)}
                      placeholder="Write something about you..."
                      rows={4}
                      style={{
                        width: "100%",
                        resize: "vertical",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        padding: 12,
                        fontSize: 14,
                        outline: "none",
                        background: "white",
                        color: "#111",
                      }}
                    />
                  </div>

                  <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                    <button
                      className="primaryBtn"
                      type="button"
                      onClick={handleSaveBio}
                    >
                      Save Bio
                    </button>
                    <button
                      className="primaryBtn"
                      type="button"
                      onClick={handleCancelBio}
                      style={{ background: "#9ca3af" }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {/* Profile picture card */}
              <div className="card" style={{ marginTop: 14 }}>
                <div className="sectionTitle">Profile picture</div>
                <p className="muted">
                  Upload a photo to set your profile picture.
                </p>

                <button
                  className="primaryBtn"
                  type="button"
                  onClick={handleUploadClick}
                >
                  📷 Upload Photo
                </button>

                {/* hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>

              {/* MySchedule card */}
              <div className="card">
                <div className="sectionTitle">MySchedule</div>
                <p className="muted">
                  View and edit your weekly class schedule.
                </p>

                <button
                  className="primaryBtn"
                  type="button"
                  onClick={() => navigate("/myschedule")}
                >
                  ✏️ Edit MySchedule
                </button>
              </div>
            </div>
          </div>

          {/* Schedule preview */}
          <div className="card scheduleCard">
            <div className="sectionTitle">Schedule</div>
            <MySchedule embedded />
          </div>
        </div>
      </div>
    </>
  );
}
