import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
// import ProtectedRoute from "./Components/ProtectedRoute";
import CreateEvent from "./pages/CreateEvent";
import Feed from "./pages/feed";
import EventDetail from "./pages/EventDetail";
import Dashboard from "./pages/Dashboard";
import Navbar from "./Components/NavBar";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/feed" element={<Feed />} />
          <Route path="/event/:id" element={<EventDetail />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/create" element={<CreateEvent />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
