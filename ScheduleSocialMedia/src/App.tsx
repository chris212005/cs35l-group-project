import { Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import Messaging from "./Messaging";
import Login from "./Login_SignUp";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";


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
  <Route path="/find-users" element={<FindUsers />} />
</Routes>

  
  );
}
