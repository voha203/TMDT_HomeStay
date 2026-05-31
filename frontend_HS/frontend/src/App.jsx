import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Host from "./pages/Host";
import HomestayDetail from "./pages/HomestayDetail";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/host" element={<Host />} />

        <Route path="/homestay/:id" element={<HomestayDetail />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

    </BrowserRouter>

  );
}

export default App;