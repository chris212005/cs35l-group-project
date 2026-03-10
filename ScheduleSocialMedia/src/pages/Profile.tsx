import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MySchedule from "./MySchedule";
import "./Profile.css";
import TopBar from "../components/TopBar";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/usersSlice";

const DEFAULT_AVATAR: string | null = null; // no default image — keep empty when user has none

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
  const [savingPic, setSavingPic] = useState(false);
  const prevProfileRef = useRef<string | null>(null);

  // ---------- Bio ----------
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [draftBio, setDraftBio] = useState("");

  // initialize from Redux currentUser (populated by ProtectedRoute)
  useEffect(() => {
    if (currentUser) {
      // prefer user's pic, otherwise keep empty (no default image)
      setProfilePic(currentUser.profilePic ?? DEFAULT_AVATAR);
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
      // optimistic update: store previous, update local and redux immediately
      prevProfileRef.current = profilePic;
      setProfilePic(dataUrl);
      setSavingPic(true);
      dispatch(setUser({ ...(currentUser || {}), profilePic: dataUrl }));

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
            // keep optimistic UI but update redux back to previous if desired
            dispatch(setUser({ ...(currentUser || {}), profilePic: prevProfileRef.current }));
            setProfilePic(prevProfileRef.current);
          }
        } catch (error) {
          console.error("Error updating profile picture:", error);
          // rollback on error
          dispatch(setUser({ ...(currentUser || {}), profilePic: prevProfileRef.current }));
          setProfilePic(prevProfileRef.current);
        } finally {
          setSavingPic(false);
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

  // Reset profile picture to default (no confirm)
  const handleResetProfilePic = async () => {
    // nothing to do if user doesn't have an image
    if (!profilePic) return;

    // optimistic update + rollback on error
    const prev = profilePic;
    prevProfileRef.current = prev;
    setProfilePic(null);
    setSavingPic(true);
    dispatch(setUser({ ...(currentUser || {}), profilePic: "" }));

    try {
      const token = localStorage.getItem("token");
      const resp = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ profilePic: "" }),
      });
      const json = await resp.json();
      if (json && json.success) {
        dispatch(setUser(json.data));
        setProfilePic(json.data.profilePic ?? null);
      } else {
        console.error("Reset avatar failed:", json);
        // rollback
        dispatch(setUser({ ...(currentUser || {}), profilePic: prev }));
        setProfilePic(prev);
      }
    } catch (error) {
      console.error("Error resetting profile picture:", error);
      // rollback
      dispatch(setUser({ ...(currentUser || {}), profilePic: prev }));
      setProfilePic(prev);
    } finally {
      setSavingPic(false);
    }
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
                  disabled={savingPic}
                >
                  📷 Upload Photo
                </button>

                <button
                  className="primaryBtn"
                  type="button"
                  onClick={handleResetProfilePic}
                  style={{ marginLeft: 8, background: "#9ca3af" }}
                  disabled={!profilePic || savingPic}
                >
                  Reset to default
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
