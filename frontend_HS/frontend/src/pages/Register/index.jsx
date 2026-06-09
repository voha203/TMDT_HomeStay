import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [user, setUser] = useState({ fullName: "", email: "", password: "", role: "USER" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Gọi đúng API endpoint mới sửa ở bước 1
      await axios.post("http://localhost:8080/api/users/register", user);
      alert("Đăng ký thành công tài khoản!");
      navigate("/login"); // Chuyển sang màn hình login ngay
    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Email đã tồn tại hoặc đăng ký lỗi!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">Tạo tài khoản</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Khám phá không gian nghỉ dưỡng tuyệt vời cùng chúng tôi</p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
            <input
              type="text"
              name="fullName"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition"
              placeholder="Nguyễn Văn A"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition"
              placeholder="example@gmail.com"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition"
              placeholder="Tối thiểu 6 ký tự"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bạn tham gia với tư cách</label>
            <select
              name="role"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition"
              onChange={handleChange}
            >
              <option value="USER">Khách tìm phòng (Customer)</option>
              <option value="HOST">Chủ nhà cho thuê (Host)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3.5 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20"
          >
            Đăng ký tài khoản
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-blue-900 font-semibold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;