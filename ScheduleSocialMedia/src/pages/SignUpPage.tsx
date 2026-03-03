import React from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../apiCalls/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import bruinCordLogo from "../assets/BruinCordLogo.png";

export default function SignUpPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const styles = `
    input {
      transition: all 0.25s ease;
    }

    input:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.6);
      transform: translateY(-1px);
    }

    .signup-btn {
      transition: all 0.25s ease;
    }

    .signup-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(0,0,0,0.25);
      filter: brightness(1.05);
    }
  `;

  const [user, setUser] = React.useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  async function onFormSubmit() {
    try {
      dispatch(showLoader());
      const response = await signupUser(user);
      dispatch(hideLoader());

      if (response.success) {
        toast.success(response.message);
        navigate("/profile");
      } else {
        dispatch(hideLoader());
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An unknown error occurred");
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#3f3f46",
    color: "white",
    width: "100%",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#111827",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#4f9dff",
      }}
    >
      <style>{styles}</style>

      {/* Logo */}
      <img
        src={bruinCordLogo}
        alt="BruinCord Logo"
        style={{
          position: "absolute",
          top: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "520px",
        }}
      />

      {/* White Card */}
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
          textAlign: "center",
          width: "500px",
        }}
      >
        <h1 style={{ marginBottom: "5px", color: "#111827" }}>
          Create Account
        </h1>

        <p style={{ marginBottom: "25px", color: "gray", fontSize: "14px" }}>
          Use your UCLA email to sign up
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onFormSubmit();
          }}
        >
          {/* First + Last */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "15px",
            }}
          >
            <input
              type="text"
              placeholder="First Name"
              style={inputStyle}
              value={user.firstname}
              onChange={(e) =>
                setUser({ ...user, firstname: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Last Name"
              style={inputStyle}
              value={user.lastname}
              onChange={(e) =>
                setUser({ ...user, lastname: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="email"
              placeholder="UCLA Email"
              style={inputStyle}
              value={user.email}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
            />
          </div>

          {/* Password + Button */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input
              type="password"
              placeholder="Password"
              style={inputStyle}
              value={user.password}
              onChange={(e) =>
                setUser({ ...user, password: e.target.value })
              }
            />

            <button
              type="submit"
              style={buttonStyle}
              className="signup-btn"
            >
              Sign Up
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              marginTop: "15px",
              background: "none",
              border: "none",
              color: "#2563eb",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        </form>
      </div>
    </div>
  );
}