import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        loginData
      );

      if (response.data) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );

        alert("Đăng nhập thành công!");

        // Điều hướng theo role
        if (response.data.role === "ADMIN") {
          navigate("/admin");
        }
        else if (response.data.role === "HOST") {
          navigate("/host");
        }
        else {
          navigate("/");
        }

      } else {
        alert("Sai email hoặc mật khẩu!");
      }

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data ||
        "Đăng nhập thất bại!"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">Chào mừng trở lại</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Vui lòng đăng nhập tài khoản Luxestay của bạn</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition"
              placeholder="name@company.com"
              onChange={handleChange}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>
              {/*QUÊN MẬT KHẨU */}
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-blue-900 hover:underline transition"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition"
              placeholder="••••••••"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3.5 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20 cursor-pointer"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-900 font-semibold hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;