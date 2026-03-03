import React from "react";
import { useNavigate } from "react-router-dom";
import bruinCordLogo from "../assets/BruinCordLogo.png";

export default function Login() {
  const styles = `
  @keyframes pulseStar {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }

  /* Subtle premium float */
  @keyframes floatLogo {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
    100% { transform: translateY(0px); }
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
  };

  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        backgroundColor: "#4f9dff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{styles}</style>

      {/* LOGO CONTAINER (fixed position) */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      >
        <img
          src={bruinCordLogo}
          alt="BruinCord Logo"
          style={{
            width: "580px",
            animation: "floatLogo 3.5s ease-in-out infinite",
            filter: "drop-shadow(0 14px 25px rgba(0,0,0,0.25))",
          }}
        />
      </div>

      {/* WHITE CARD */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.18)",
          border: "2px solid #d1d5db",
          width: "420px",
          textAlign: "center",
          marginTop: "70px",
        }}
      >
        <h1 style={{ color: "#454545" }}>Login / Sign Up</h1>

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
      </div>
    </div>
  );
}