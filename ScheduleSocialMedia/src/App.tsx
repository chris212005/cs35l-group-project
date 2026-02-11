import { Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import Messaging from "./Messaging";
import Login from "./Login_SignUp";

export default function App() {
  return (
    <Routes>
      {/* Temporary: show login first */}
      <Route path="/" element={<Login />} />

      {/* Teammates' pages */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/messaging" element={<Messaging />} />
    </Routes>
  );
}
