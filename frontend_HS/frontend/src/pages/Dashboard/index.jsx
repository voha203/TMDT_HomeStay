import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || (user.role !== "HOST" && user.role !== "ADMIN")) {
      alert("Bạn không có quyền truy cập vào trang thống kê!");
      navigate("/");
      return;
    }
    fetchAnalytics(user.id);
  }, [navigate]);

  const fetchAnalytics = async (hostId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/bookings/host/${hostId}/analytics`);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu thống kê:", error);
    }
  };

  if (!analyticsData) {
    return <div className="text-center py-20 font-bold">Đang tải dữ liệu thống kê biểu đồ...</div>;
  }

  // 1. Cấu hình dữ liệu cho Biểu đồ Cột (Doanh thu theo thời gian)
  const barChartData = {
    labels: analyticsData.monthlyLabels,
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: analyticsData.monthlyData,
        backgroundColor: "rgba(30, 58, 138, 0.8)", // Màu xanh Navy đồng bộ giao diện
        borderRadius: 8,
      },
    ],
  };

  // 2. Cấu hình dữ liệu cho Biểu đồ Tròn (Doanh thu theo danh mục hàng hóa)
  const pieChartData = {
    labels: analyticsData.categoryLabels,
    datasets: [
      {
        data: analyticsData.categoryData,
        backgroundColor: [
          "rgba(249, 115, 22, 0.8)",  // Cam
          "rgba(14, 165, 233, 0.8)",  // Xanh dương light
          "rgba(16, 185, 129, 0.8)",  // Xanh lá
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-32 space-y-10">
        
        {/* Khối Thẻ Tổng Quan */}
        <div className="p-6 border-b border-gray-200 bg-white rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-950">Báo cáo & Thống kê Doanh thu</h1>
            <p className="text-gray-500 text-sm mt-1">Dữ liệu kinh doanh trực quan của cửa hàng</p>
          </div>
          <div className="flex gap-6">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <span className="text-xs text-blue-700 font-bold uppercase block">Tổng doanh thu</span>
              <span className="text-xl font-black text-blue-900">{analyticsData.totalRevenue?.toLocaleString()} VNĐ</span>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
              <span className="text-xs text-orange-700 font-bold uppercase block">Đơn thành công</span>
              <span className="text-xl font-black text-orange-900">{analyticsData.totalBookings} đơn hàng</span>
            </div>
          </div>
        </div>

        {/* Khối chứa 2 Biểu đồ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Biểu đồ Cột */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-950 mb-6">📊 Biểu đồ cột: Doanh thu theo tháng</h3>
            <div className="h-80 flex items-center justify-center">
              <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Biểu đồ Tròn */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-950 mb-6">🍕 Biểu đồ tròn: Tỷ lệ doanh thu theo loại hàng hóa</h3>
            <div className="h-80 flex items-center justify-center">
              <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;