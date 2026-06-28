import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";

function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const res = await axios.get("http://localhost:8080/api/admin/analytics");
    setData(res.data);
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-950/20 border-t-blue-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  const COLORS = ["#3b82f6", "#10b981", "#ef4444"];

  return (
    // THAY ĐỔI Ở ĐÂY: Thêm nền grid mờ và các khối màu gradient ẩn phía sau để xóa cảm giác trống trải
    <div className="min-h-screen bg-slate-50/50 relative overflow-hidden p-6 md:p-10 pt-28">
      
      {/* Các khối màu trang trí nền (Background Ornaments) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Lớp lưới Grid tinh tế */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Tiêu đề trang */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-blue-950 tracking-tight">
            Admin Analytics<span className="text-orange-500">.</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Tổng quan và phân tích số liệu hệ thống Luxestay
          </p>
        </div>

        {/* Khu vực thẻ hiển thị số liệu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Users" value={data.users} />
          <Card title="Homestays" value={data.homestays} />
          <Card title="Bookings" value={data.bookings} />
          <Card title="Revenue" value={`${data.revenue.toLocaleString()} đ`} isRevenue={true} />
        </div>

        {/* Khu vực biểu đồ */}
        <div className="grid lg:grid-cols-12 gap-8 mt-10">
          
          {/* Biểu đồ Tròn */}
          <div className="lg:col-span-5 bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm shadow-gray-100/50">
            <h2 className="font-bold text-blue-950 text-lg mb-1">Booking Status</h2>
            <p className="text-xs text-gray-400 font-medium mb-6">Tỉ lệ trạng thái đặt phòng hệ thống</p>
            
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.bookingStatus}
                    dataKey="value"
                    innerRadius={75} // Biến thành Donut chart để nhìn đầy đặn và sang hơn
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {data.bookingStatus.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Biểu đồ Cột */}
          <div className="lg:col-span-7 bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm shadow-gray-100/50">
            <h2 className="font-bold text-blue-950 text-lg mb-1">Revenue Overview</h2>
            <p className="text-xs text-gray-400 font-medium mb-6">Biểu đồ doanh thu phát triển theo tháng</p>
            
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyRevenue} barSize={28}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function Card({ title, value, isRevenue }) {
  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-gray-100/80 shadow-sm shadow-gray-100/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">
        {title}
      </div>
      <div className={`text-3xl font-black tracking-tight ${isRevenue ? 'text-orange-500' : 'text-blue-950'}`}>
        {value}
      </div>
    </div>
  );
}

export default Analytics;