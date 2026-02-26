import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Messaging from "./pages/Messaging";
import Login from "./pages/Login_SignUp";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./components/protectedRoute.jsx";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import Loader from "./components/loader";
import FindUsers from "./pages/FindUsers";

export default function App() {
  const loader = useSelector((state: any) => state.loaderReducer);
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      {loader && <Loader />}
      <Routes>
        {/* landing page */}
        <Route path="/" element={<Login />} />

        {/* new pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* profile & messaging pages */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/messaging" element={<Messaging />} />
        <Route
          path="/find-users"
          element={
            <ProtectedRoute>
              <FindUsers />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
