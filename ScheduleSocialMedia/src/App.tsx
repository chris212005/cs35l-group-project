import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Messaging from "./pages/Messaging";
import Login from "./pages/Login_SignUp";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import FindUsers from "./pages/FindUsers";
import MySchedule from "./pages/MySchedule";  
import ProtectedRoute from "./components/protectedRoute.jsx";


export default function App() {
  return (
    <Routes>
      {/* landing page */}
      <Route path="/" element={<Login />} />

      {/* new pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* profile & messaging pages */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/messaging" element={<Messaging />} />

      {/* Friend page (so TopBar "Friend" tab works) */}
      <Route path="/find-users" element={<FindUsers />} />

      {/* MySchedule page (teammate's schedule page) */}
      <Route path="/myschedule" element={<MySchedule />} />   {/* ← ADD THIS */}
    </Routes>
  );
}