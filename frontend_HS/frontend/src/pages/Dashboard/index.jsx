import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]); // State lưu danh sách user dành cho Admin

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || (user.role !== "HOST" && user.role !== "ADMIN")) {
      alert("Bạn không có quyền truy cập!");
      navigate("/");
      return;
    }
    setCurrentUser(user);
    fetchAnalytics(user.id);

    // Nếu người đăng nhập là ADMIN -> Kích hoạt lấy danh sách người dùng
    if (user.role === "ADMIN") {
      fetchAllUsers();
    }
  }, [navigate]);

  const fetchAnalytics = async (hostId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/bookings/host/${hostId}/analytics`);
      setAnalyticsData(response.data);
    } catch (error) { console.error(error); }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users");
      setAllUsers(response.data);
    } catch (error) { console.error(error); }
  };

  if (!analyticsData) return <div className="text-center py-20 font-bold">Đang tải...</div>;

  const barChartData = {
    labels: analyticsData.monthlyLabels,
    datasets: [{ label: "Doanh thu (VNĐ)", data: analyticsData.monthlyData, backgroundColor: "rgba(30, 58, 138, 0.8)", borderRadius: 8 }],
  };

  const pieChartData = {
    labels: analyticsData.categoryLabels,
    datasets: [{ data: analyticsData.categoryData, backgroundColor: ["rgba(249, 115, 22, 0.8)", "rgba(14, 165, 233, 0.8)", "rgba(16, 185, 129, 0.8)"], borderWidth: 1 }],
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-32 space-y-10">
        
        <div className="p-6 border-b border-gray-200 bg-white rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-950">Báo cáo & Thống kê Hệ thống</h1>
            <p className="text-gray-500 text-sm mt-1">Xin chào quản trị: <span className="text-blue-900 font-bold">{currentUser?.fullName}</span></p>
          </div>
          <div className="flex gap-6">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <span className="text-xs text-blue-700 font-bold uppercase block">Tổng doanh thu</span>
              <span className="text-xl font-black text-blue-900">{analyticsData.totalRevenue?.toLocaleString()} VNĐ</span>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
              <span className="text-xs text-orange-700 font-bold uppercase block">Đơn thành công</span>
              <span className="text-xl font-black text-orange-900">{analyticsData.totalBookings} đơn</span>
            </div>
          </div>
        </div>

        {/* 2 BIỂU ĐỒ DOANH THU */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-950 mb-6">📊 Biểu đồ cột: Doanh thu theo tháng</h3>
            <div className="h-80"><Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-950 mb-6">🍕 Biểu đồ tròn: Tỷ lệ doanh thu theo loại hàng hóa</h3>
            <div className="h-80"><Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
          </div>
        </div>

        {/* 👑 KHU VỰC ĐẶC QUYỀN ADMIN: QUẢN LÝ THÀNH VIÊN (CHỈ ADMIN MỚI THẤY) */}
        {currentUser && currentUser.role === "ADMIN" && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-red-50/20">
              <h2 className="text-xl font-black text-red-950">🔑 Phân hệ ADMIN: Quản lý toàn bộ người dùng hệ thống</h2>
              <p className="text-xs text-gray-400 mt-1">Kiểm soát danh sách tài khoản đăng ký trên cơ sở dữ liệu MySQL</p>
            </div>
            <div className="overflow-x-auto text-xs md:text-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-100">
                    <th className="p-4 pl-6">ID Người dùng</th>
                    <th className="p-4">Tên công khai</th>
                    <th className="p-4">Địa chỉ Email</th>
                    <th className="p-4 pr-6">Vai trò hệ thống</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                  {allUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/30 transition">
                      <td className="p-4 pl-6 font-bold text-gray-400">#USR-{u.id}</td>
                      <td className="p-4 font-bold text-gray-900">{u.fullName}</td>
                      <td className="p-4 font-semibold">{u.email}</td>
                      <td className="p-4 pr-6">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide ${
                          u.role === "ADMIN" ? "bg-red-100 text-red-800" : u.role === "HOST" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;