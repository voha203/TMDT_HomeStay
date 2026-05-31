import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:8080/api/users/forgot-password?email=${email}`);
      alert(response.data);
    } catch (error) {
      console.error("Lỗi chi tiết từ hệ thống:", error.response);
      
      // Bẻ khóa [object Object] để lấy ra đoạn text thông báo thực sự
      const errorData = error.response?.data;
      if (typeof errorData === "object" && errorData !== null) {
        // Nếu Backend trả về object, ta lôi trường 'message' hoặc biến đổi thành chữ
        alert(errorData.message || JSON.stringify(errorData));
      } else {
        alert(errorData || "Có lỗi xảy ra trong quá trình gửi mail!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900">🔑 Quên mật khẩu?</h2>
          <p className="text-sm text-gray-500 mt-1">Nhập email đăng ký, hệ thống sẽ gửi link đặt lại mật khẩu về hộp thư của bạn.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Nhập địa chỉ Email của bạn..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-950/20 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition shadow-sm text-sm disabled:bg-gray-400">
            {loading ? "Đang gửi mail xử lý..." : "Gửi yêu cầu khôi phục"}
          </button>
        </form>
        <div className="text-center text-sm">
          <Link to="/login" className="text-blue-900 font-semibold hover:underline">← Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;