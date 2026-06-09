import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";

function Admin() {
  // 1. Lấy thông tin user từ localStorage và kiểm tra quyền ngay đầu component
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = !!user && user.role === "ADMIN";

  // 2. Khai báo state ở mức top-level để tuân thủ Rules of Hooks
  const [users, setUsers] = useState([]);
  const [homestays, setHomestays] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    if (!isAdmin) return;
    fetchUsers();
    fetchHomestays();
    fetchBookings();
    fetchRevenue();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="text-center py-20 text-red-500 font-semibold text-xl">
        Bạn không có quyền truy cập trang này.
      </div>
    );
  }

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-32">
        <h1 className="text-4xl font-black mb-10">Admin Dashboard</h1>

        {/* Sửa phần Stats gồm 4 Card */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow">
            <h3>Tổng User</h3>
            <p className="text-4xl font-black">{users.length}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <h3>Tổng Homestay</h3>
            <p className="text-4xl font-black">{homestays.length}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <h3>Tổng Booking</h3>
            <p className="text-4xl font-black">{bookings.length}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <h3>Doanh Thu</h3>
            <p className="text-3xl font-black text-green-600">
              {revenue.toLocaleString()} VNĐ
            </p>
          </div>
        </div>

        {/* Card Thống kê trạng thái Booking */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-green-50 p-6 rounded-3xl">
            <h3>Đã Duyệt</h3>
            <p className="text-4xl font-black">{confirmedBookings}</p>
          </div>

          <div className="bg-yellow-50 p-6 rounded-3xl">
            <h3>Đang Chờ</h3>
            <p className="text-4xl font-black">{pendingBookings}</p>
          </div>

          <div className="bg-red-50 p-6 rounded-3xl">
            <h3>Đã Hủy</h3>
            <p className="text-4xl font-black">{cancelledBookings}</p>
          </div>
        </div>

        {/* Bước 5: Bảng User */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-black">Quản lý User</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Họ tên</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="p-4">{user.id}</td>
                  <td className="p-4">{user.fullName}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bước 6: Bảng Homestay */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-black">Quản lý Homestay</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Tên</th>
                <th className="p-4 text-left">Địa điểm</th>
                <th className="p-4 text-left">Giá</th>
                <th className="p-4 text-left">Host</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {homestays.map((item) => (
                <tr key={item.id}>
                  <td className="p-4">{item.id}</td>
                  <td className="p-4">{item.title}</td>
                  <td className="p-4">{item.location}</td>
                  <td className="p-4">{item.price?.toLocaleString()}</td>
                  <td className="p-4">{item.user?.fullName}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => deleteHomestay(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bước 7: Bảng Booking */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-black">Quản lý Booking</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Khách</th>
                <th className="p-4 text-left">Homestay</th>
                <th className="p-4 text-left">Tổng tiền</th>
                <th className="p-4 text-left">Trạng thái</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((item) => (
                <tr key={item.id}>
                  <td className="p-4">{item.id}</td>
                  <td className="p-4">{item.user?.fullName}</td>
                  <td className="p-4">{item.homestay?.title}</td>
                  <td className="p-4">{item.totalPrice?.toLocaleString()}</td>
                  <td className="p-4">{item.status}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => deleteBooking(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
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
  );
}

export default Admin;