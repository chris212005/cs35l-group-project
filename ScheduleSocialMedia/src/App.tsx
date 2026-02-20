import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Messaging from "./pages/Messaging";
import Login from "./pages/Login_SignUp";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
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
      <Route path="/profile" element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>} />

      <Route path="/messaging" element={<Messaging />} />
      {/*<Route path="/find-users" element={<FindUsers />} />*/}
    </Routes>

  
  );
}
