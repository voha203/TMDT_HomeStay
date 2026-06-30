import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import Notification from "../../components/Notification.jsx";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token"); // Lấy mã token từ đường link URL mail kích hoạt sang

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        Notification.error("Mật khẩu xác nhận không trùng khớp!");
      return;
    }

    try {
      // Sử dụng URLSearchParams để đóng gói tham số @RequestParam chuẩn cấu hình gửi đi
      const params = new URLSearchParams();
      params.append("token", token);
      params.append("newPassword", newPassword);

      const response = await axios.post("http://localhost:8080/api/users/reset-password", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      alert(response.data);
      navigate("/login"); 
    } catch (error) {
      console.error("Lỗi đổi mật khẩu chi tiết:", error.response);
      const errorData = error.response?.data;
      if (typeof errorData === "object" && errorData !== null) {
        alert(errorData.message || JSON.stringify(errorData));
      } else {
          Notification.error(errorData || "Mã token không hợp lệ hoặc đã hết hạn!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900">🔒 Đặt lại mật khẩu</h2>
          <p className="text-sm text-gray-500 mt-1">Vui lòng thiết lập mật khẩu mới cho tài khoản bảo mật của bạn.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            placeholder="Nhập mật khẩu mới..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-950/20 text-sm"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Xác nhận lại mật khẩu mới..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-950/20 text-sm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-sm text-sm">
            Xác nhận đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;