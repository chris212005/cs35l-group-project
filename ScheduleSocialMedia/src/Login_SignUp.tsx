import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const styles = `
  @keyframes pulseStar {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }
  `;

  const buttonStyle: React.CSSProperties = {
    margin: "10px",
    width: "120px",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#111827",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
    opacity: 1,
    filter: "none",
    pointerEvents: "auto",
  };

  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#4f9dff",
      }}
    >
      {/* THIS LOADS ANIMATION INTO THE PAGE */}
      <style>{styles}</style>

      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.18)",
          border: "2px solid #d1d5db",
        }}
      >
        <h1 style={{ color: "#454545" }}>Login / Sign Up</h1>

        {/*
          For now these are just visual placeholders.
          We can wire these up to real auth later
          once we decide how login is handled.
        */}

        {/* Only UCLA emails (g.ucla.edu) should work */}
        <p style={{ marginBottom: "20px", color: "gray" }}>
          <span
            style={{
              color: "red",
              fontWeight: "bold",
              display: "inline-block",
              animation: "pulseStar 1.2s infinite",
            }}
          >
            *
          </span>{" "}
          You must use your UCLA email (g.ucla.edu) to sign up or log in.
        </p>

        <button style={buttonStyle} onClick={() => navigate("/login")}>
          Log In
        </button>

        <button style={buttonStyle} onClick={() => navigate("/signup")}>
          Sign Up
        </button>

        {/*
          Eventually clicking either button should route the user to the profile page.
          (have to wait for the person to do profile.tsx, so this is a very simple version for now)
        */}
      </div>
    </div>
  );
}
