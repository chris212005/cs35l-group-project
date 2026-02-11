import React from "react";

export default function Login() {
  const styles = `
  @keyframes pulseStar {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }
  `;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // centers horizontally
        justifyContent: "center", // centers vertically
        height: "100vh", // full screen height
        textAlign: "center",
        backgroundColor: "#4f9dff", // (different codes for different colors) blue background
      }}
    >
      {/* THIS LOADS ANIMATION INTO THE PAGE */}
      <style>{styles}</style>

      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.18)", // softer glow
          border: "2px solid #d1d5db", // nice neutral gray
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

        <button style={{ margin: "10px", width: "120px" }}>Log In</button>

        <button style={{ margin: "10px", width: "120px" }}>Sign Up</button>

        {/*
          Eventually clicking either button should route the user to the profile page.
          (have to wait for the person to do profile.tsx, so this is a very simple version for now)
        */}
      </div>
    </div>
  );
}
