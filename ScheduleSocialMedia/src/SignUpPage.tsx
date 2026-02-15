import React from "react";
import { useNavigate } from "react-router-dom";
//import { signupUser } from "./apiCalls/auth";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [user, setUser] = React.useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  function onFormSubmit() {
    // Call the signup API with user data
    // signupUser(user)
    //   .then((response) => {
    //     // Handle successful signup (e.g., navigate to profile)
    //     navigate("/profile");
    //   })
    //   .catch((error) => {
    //     // Handle signup error (e.g., show error message)
    //     console.error("Signup failed:", error);
    //   });
    console.log("Form submitted with user data:", user);
  }

  const inputStyle: React.CSSProperties = {
    width: "260px",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#3f3f46",
    color: "white",
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: "10px",
    width: "140px",
    padding: "10px",
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#4f9dff",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "5px", color: "#111827" }}>
          Create Account
        </h1>

        <p style={{ marginBottom: "20px", color: "gray", fontSize: "14px" }}>
          Use your UCLA email to sign up
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onFormSubmit();
          }}
          >
          <input
            type="text"
            placeholder="First Name"
            style={inputStyle}
            value = {user.firstname}
            onChange = {(e) => setUser({...user, firstname: e.target.value})}
          />

          <input
            type="text"
            placeholder="Last Name"
            style={inputStyle}
            value = {user.lastname}
            onChange = {(e) => setUser({...user, lastname: e.target.value})}
          />

          <br />

          <input
            type="email"
            placeholder="UCLA Email"
            style={inputStyle}
            value = {user.email}
            onChange = {(e) => setUser({...user, email: e.target.value})}
          />

          <br />

          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            value = {user.password}
            onChange = {(e) => setUser({...user, password: e.target.value})}
          />

          <button
            type = "submit"
            style={buttonStyle}
            onClick={() => navigate("/profile")}
          >
            Sign Up
          </button>

          <br />

          <button
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
