import { Link, useNavigate } from "react-router-dom";
import Notification from "./Notification.jsx";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    Notification.success("Đã đăng xuất thành công!");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black text-blue-900 tracking-tight">
          Luxestay<span className="text-orange-500">.</span>
        </Link>

        <nav className="flex items-center gap-8 font-medium text-gray-700">
          <Link to="/" className="hover:text-blue-900 transition">
            Trang chủ
          </Link>

          {/* Menu dành riêng cho HOST hoặc ADMIN */}
          {user && (user.role === "HOST" || user.role === "ADMIN") && (
            <>
              <Link to="/host" className="hover:text-blue-900 transition">
                Đăng homestay
              </Link>
              <Link to="/dashboard" className="hover:text-blue-900 transition">
                Xem doanh thu
              </Link>
            </>
          )}

          {/* Menu xử lý Trạng thái Đăng nhập / Đăng xuất */}
          {user ? (
            <div className="flex items-center gap-6">
              {/* Lịch sử đặt phòng dành cho mọi User đã đăng nhập */}
              <Link to="/profile" className="text-gray-700 hover:text-blue-950 font-semibold text-sm transition">
                📜 Lịch sử đặt phòng
              </Link>

              <Link to="/wishlist" className="text-gray-700 hover:text-blue-950 font-semibold text-sm transition">
                ❤️ Yêu thích
              </Link>

              {user.role === "ADMIN" && (
                <Link to="/admin" className="text-red-600 hover:text-red-700 font-bold text-sm transition">
                  ⚙️ Quản trị
                </Link>
              )}

              <Link
                to="/profile"
                className="text-sm bg-blue-50 text-blue-900 px-3 py-1.5 rounded-full font-semibold hover:bg-blue-100 transition"
                title="Xem hồ sơ cá nhân"
              >
                👋 {user.fullName} ({user.role})
              </Link>
              
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 font-semibold text-sm transition cursor-pointer"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-900 text-white px-5 py-2.5 rounded-xl hover:bg-blue-800 transition shadow-md shadow-blue-900/20"
            >
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;