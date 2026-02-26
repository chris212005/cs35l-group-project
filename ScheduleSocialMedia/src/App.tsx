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

import ProtectedRoute from "./components/protectedRoute.jsx";
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

        {/* ================= PROTECTED PAGES ================= */}

        {/* Profile page */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Messaging page */}
        <Route
          path="/messaging"
          element={
            <ProtectedRoute>
              <Messaging />
            </ProtectedRoute>
          }
        />

        {/* Friend page (TopBar "Friend" tab works) */}
        <Route
          path="/find-users"
          element={
            <ProtectedRoute>
              <FindUsers />
            </ProtectedRoute>
          }
        />

        {/* MySchedule page */}
        <Route
          path="/myschedule"
          element={
            <ProtectedRoute>
              <MySchedule />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}