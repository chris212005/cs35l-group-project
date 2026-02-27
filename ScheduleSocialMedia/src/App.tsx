import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import Profile from "./pages/Profile";
import Messaging from "./pages/Messaging";
import Login from "./pages/Login_SignUp";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import FindUsers from "./pages/FindUsers";
import MySchedule from "./pages/MySchedule";

import Loader from "./components/loader";

export default function App() {
  const loader = useSelector((state: any) => state.loaderReducer);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      {loader && <Loader />}

      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Login />} />

        {/* Auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* TESTING: No ProtectedRoute for now */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/find-users" element={<FindUsers />} />
        <Route path="/myschedule" element={<MySchedule />} />
      </Routes>
    </div>
  );
}