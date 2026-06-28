import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Analytics from "./Analytics";

function Admin() {
  // 1. Lấy thông tin user từ localStorage và kiểm tra quyền ngay đầu component
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-xl max-w-md text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-blue-950 mb-2">Truy cập bị từ chối</h2>
          <p className="text-gray-500 text-sm font-medium">Bạn không có quyền truy cập vào trang quản trị viên này.</p>
        </div>
      </div>
    );
  }

  // 2. Nếu là ADMIN thì mới chạy tiếp các logic bên dưới
  const [users, setUsers] = useState([]);
  const [homestays, setHomestays] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    fetchUsers();
    fetchHomestays();
    fetchBookings();
    fetchRevenue();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8080/api/users");
    setUsers(res.data);
  };

  const fetchHomestays = async () => {
    const res = await axios.get("http://localhost:8080/api/homestays");
    setHomestays(res.data);
  };

  const fetchBookings = async () => {
    const res = await axios.get("http://localhost:8080/api/bookings");
    setBookings(res.data);
  };

  const fetchRevenue = async () => {
    const res = await axios.get(
      "http://localhost:8080/api/bookings/admin/revenue"
    );
    setRevenue(res.data);
  };

  // Bước 5: Hàm xóa User
  const deleteUser = async (id) => {
    if (!window.confirm("Xóa user này?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert("Không thể xóa user");
    }
  };

  // Bước 6: Hàm xóa Homestay
  const deleteHomestay = async (id) => {
    if (!window.confirm("Xóa homestay này?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/homestays/${id}`);
      fetchHomestays();
    } catch (error) {
      alert("Không thể xóa");
    }
  };

  // Bước 7: Hàm xóa Booking
  const deleteBooking = async (id) => {
    if (!window.confirm("Xóa booking này?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/bookings/${id}`);
      fetchBookings();
    } catch (error) {
      alert("Không thể xóa booking");
    }
  };

  // Bước 9: Thống kê Booking theo trạng thái
  const confirmedBookings = bookings.filter(
    (b) => b.status === "CONFIRMED"
  ).length;

  const pendingBookings = bookings.filter(
    (b) => b.status === "PENDING"
  ).length;

  const cancelledBookings = bookings.filter(
    (b) => b.status === "CANCELLED"
  ).length;

  // Hàm phụ trợ tạo Badge trạng thái có màu sắc đẹp
  const renderStatusBadge = (status) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">Đã Duyệt</span>;
      case "PENDING":
        return <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">Đang Chờ</span>;
      case "CANCELLED":
        return <span className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-bold border border-rose-100">Đã Hủy</span>;
      default:
        return <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen relative overflow-hidden">
      <Navbar />

      {/* Các khối màu trang trí nền mờ ẩn phía sau để giảm trống trải */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-32 relative z-10">

        {/* Header Title */}
        <div className="mb-12 bg-blue-900 text-white p-8 rounded-3xl shadow-lg shadow-blue-900/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Họa tiết vòng tròn trang trí ẩn trong khung xanh cho đỡ trống trải */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-800/40 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
              Admin Dashboard<span className="text-orange-400">.</span>
            </h1>
            <p className="text-blue-100/90 font-medium text-sm mt-1.5">
              Hệ thống quản lý thông tin cốt lõi của ứng dụng Luxestay
            </p>
          </div>

          {/* Nút badge hiển thị nhanh vai trò hoặc trạng thái hệ thống bên trong khung */}
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs font-bold tracking-wide uppercase self-start md:self-auto">
            Hệ thống vận hành thực thời
          </div>
        </div>

        {/* Gọi component Analytics của bạn */}
        <div className="mb-12">
          <Analytics
            users={users}
            homestays={homestays}
            bookings={bookings}
            revenue={revenue}
          />
        </div>

        {/* Sửa phần Stats gồm 4 Card cao cấp */}
        <div className="mb-6">
          <h2 className="text-xl font-black text-blue-950 mb-4">Số liệu tổng quan</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm shadow-gray-100/50 hover:shadow-md transition-all">
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Tổng User</h3>
            <p className="text-4xl font-black text-blue-950">{users.length}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm shadow-gray-100/50 hover:shadow-md transition-all">
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Tổng Homestay</h3>
            <p className="text-4xl font-black text-blue-950">{homestays.length}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm shadow-gray-100/50 hover:shadow-md transition-all">
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Tổng Booking</h3>
            <p className="text-4xl font-black text-blue-950">{bookings.length}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm shadow-gray-100/50 hover:shadow-md transition-all">
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Doanh Thu</h3>
            <p className="text-3xl font-black text-emerald-600">
              {revenue.toLocaleString()} <span className="text-sm font-bold">đ</span>
            </p>
          </div>
        </div>

        {/* Card Thống kê trạng thái Booking tinh tế */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          <div className="bg-emerald-50/60 border border-emerald-100 p-6 rounded-3xl">
            <h3 className="text-emerald-800 font-bold text-sm mb-1">Đã Duyệt (Confirmed)</h3>
            <p className="text-4xl font-black text-emerald-700">{confirmedBookings}</p>
          </div>

          <div className="bg-amber-50/60 border border-amber-100 p-6 rounded-3xl">
            <h3 className="text-amber-800 font-bold text-sm mb-1">Đang Chờ (Pending)</h3>
            <p className="text-4xl font-black text-amber-700">{pendingBookings}</p>
          </div>

          <div className="bg-rose-50/60 border border-rose-100 p-6 rounded-3xl">
            <h3 className="text-rose-800 font-bold text-sm mb-1">Đã Hủy (Cancelled)</h3>
            <p className="text-4xl font-black text-rose-700">{cancelledBookings}</p>
          </div>
        </div>

        {/* Bước 5: Bảng User */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100 bg-white">
            <h2 className="text-xl font-black text-blue-950">Quản lý tài khoản User</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Họ tên</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Quyền hạn</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-4 font-mono text-xs text-gray-400">#{user.id}</td>
                    <td className="p-4 font-bold text-blue-950">{user.fullName || "N/A"}</td>
                    <td className="p-4 text-gray-500">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${user.role === 'ADMIN' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bước 6: Bảng Homestay */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100 bg-white">
            <h2 className="text-xl font-black text-blue-950">Quản lý danh sách Homestay</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Tên Homestay</th>
                  <th className="p-4">Địa điểm</th>
                  <th className="p-4">Giá/Đêm</th>
                  <th className="p-4">Chủ nhà (Host)</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
                {homestays.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-4 font-mono text-xs text-gray-400">#{item.id}</td>
                    <td className="p-4 font-bold text-blue-950 line-clamp-1 max-w-[250px]">{item.title}</td>
                    <td className="p-4 text-gray-500">{item.location}</td>
                    <td className="p-4 font-bold text-orange-500">{item.price?.toLocaleString()} đ</td>
                    <td className="p-4 text-gray-600">{item.user?.fullName || "N/A"}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteHomestay(item.id)}
                        className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bước 7: Bảng Booking */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-white">
            <h2 className="text-xl font-black text-blue-950">Quản lý lịch sử đặt phòng (Booking)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Khách hàng</th>
                  <th className="p-4">Homestay</th>
                  <th className="p-4">Tổng thanh toán</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
                {bookings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-4 font-mono text-xs text-gray-400">#{item.id}</td>
                    <td className="p-4 font-bold text-blue-950">{item.user?.fullName || "N/A"}</td>
                    <td className="p-4 text-gray-600 line-clamp-1 max-w-[200px]">{item.homestay?.title || "N/A"}</td>
                    <td className="p-4 font-bold text-emerald-600">{item.totalPrice?.toLocaleString()} đ</td>
                    <td className="p-4">{renderStatusBadge(item.status)}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteBooking(item.id)}
                        className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Admin;