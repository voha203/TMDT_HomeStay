import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Host from "../pages/Host";
import HomestayDetail from "../pages/HomestayDetail";
import Profile from "../pages/Profile";
import Wishlist from "../pages/Wishlist";
import Dashboard from "../pages/Dashboard";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Admin from "../pages/Admin";

function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/homestay/:id" element={<HomestayDetail />} />

      {/* USER */}
      <Route path="/profile" element={<Profile />} />

      <Route path="/wishlist" element={<Wishlist />} />

      {/* HOST */}
      <Route path="/host" element={<Host />} />

      <Route path="/dashboard" element={<Dashboard />} />

      {/* ADMIN */}
        <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default AppRoutes;