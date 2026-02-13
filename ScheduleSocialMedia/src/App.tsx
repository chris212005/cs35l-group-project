import { Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import Messaging from "./Messaging";
import Login from "./Login_SignUp";
import FindUsers from "./FindUsers";

export default function App() {
  return (
    <Routes>
      {/* Temporary: show login first */}
      <Route path="/" element={<Login />} />

      {/* Teammates' pages */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/messaging" element={<Messaging />} />
      <Route path="/find-users" element={<FindUsers />} />
    </Routes>
  );
}
