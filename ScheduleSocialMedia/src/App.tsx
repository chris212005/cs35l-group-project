import { Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import Messaging from "./Messaging";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/messaging" element={<Messaging />} />
      </Routes>
  )
}
