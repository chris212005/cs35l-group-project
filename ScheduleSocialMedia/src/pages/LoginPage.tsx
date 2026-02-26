import React from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../apiCalls/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";

export default function LoginPage() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [user, setuser] = React.useState({
    email: "",
    password: "",
  });

  async function onFormSubmit() {
    try {
      dispatch(showLoader());
      const response = await loginUser(user);
      dispatch(hideLoader());

      if (response.success) {
        toast.success(response.message);
        localStorage.setItem("token", response.token);
        navigate("/profile");
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      dispatch(hideLoader());
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
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
        <h1 style={{ marginBottom: "5px", color: "#111827" }}>Login</h1>

        <p style={{ marginBottom: "20px", color: "gray", fontSize: "14px" }}>
          Enter your UCLA email to continue
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onFormSubmit();
          }}
        >
          <input
            type="email"
            placeholder="UCLA Email"
            style={inputStyle}
            value={user.email}
            onChange={(e) => setuser({ ...user, email: e.target.value })}
          />

          <br />

          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            value={user.password}
            onChange={(e) => setuser({ ...user, password: e.target.value })}
          />

          <br />

          <button style={buttonStyle}>Log In</button>

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
